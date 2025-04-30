const fs = require("fs");
const csv = require("csv-parser");
const { query, pool } = require("../config/db.config");
const logger = require("../utils/logger");
const validator = require("../utils/validator");

class DataLoader {
  constructor() {
    this.processedRows = 0;
  }

  async loadData(csvPath, overwrite = false) {
    const startTime = new Date();
    logger.info(`Starting data load from ${csvPath}`);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (overwrite) {
        await this.clearExistingData(client);
      }

      const stream = fs
        .createReadStream(csvPath)
        .pipe(csv())
        .on("data", async (row) => {
          stream.pause();
          try {
            validator.validateSalesRow(row);
            await this.processRow(client, row);
            this.processedRows++;

            if (this.processedRows % 1000 === 0) {
              logger.info(`Processed ${this.processedRows} rows`);
            }
          } catch (error) {
            logger.warn(
              `Row ${this.processedRows + 1} skipped: ${error.message}`
            );
          } finally {
            stream.resume();
          }
        });

      await new Promise((resolve, reject) => {
        stream.on("end", resolve);
        stream.on("error", reject);
      });

      await client.query("COMMIT");
      const duration = (new Date() - startTime) / 1000;
      logger.info(
        `Data load completed. Processed ${this.processedRows} rows in ${duration} seconds`
      );
      return { success: true, processedRows: this.processedRows };
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error(`Data load failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      client.release();
      this.processedRows = 0;
    }
  }

  async clearExistingData(client) {
    const tables = ["order_items", "orders", "products", "customers"];
    for (const table of tables) {
      try {
        await client.query(`TRUNCATE TABLE ${table} CASCADE`);
        logger.info(`Cleared data from ${table}`);
      } catch (error) {
        logger.error(`Failed to clear ${table}: ${error.message}`);
        throw error;
      }
    }
  }

  async processRow(client, row) {
    // Insert customer
    await client.query(
      `
      INSERT INTO customers (customer_id, name, email, address)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (customer_id) DO NOTHING
    `,
      [
        row["Customer ID"],
        row["Customer Name"],
        row["Customer Email"],
        row["Customer Address"],
      ]
    );

    // Insert product
    await client.query(
      `
      INSERT INTO products (product_id, name, category, unit_price)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (product_id) DO UPDATE
      SET name = $2, category = $3, unit_price = $4
    `,
      [
        row["Product ID"],
        row["Product Name"],
        row["Category"],
        row["Unit Price"],
      ]
    );

    // Insert order
    await client.query(
      `
      INSERT INTO orders (order_id, customer_id, date_of_sale, region, payment_method, shipping_cost)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (order_id) DO NOTHING
    `,
      [
        row["Order ID"],
        row["Customer ID"],
        new Date(row["Date of Sale"]),
        row["Region"],
        row["Payment Method"],
        row["Shipping Cost"],
      ]
    );

    // Insert order item
    await client.query(
      `
      INSERT INTO order_items (order_id, product_id, quantity, discount)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (order_id, product_id) DO UPDATE
      SET quantity = $3, discount = $4
    `,
      [
        row["Order ID"],
        row["Product ID"],
        parseInt(row["Quantity Sold"]),
        parseFloat(row["Discount"]),
      ]
    );
  }
}

module.exports = new DataLoader();
