const fs = require("fs");
const csv = require("csv-parser");
const db = require("../models");
const logger = require("../utils/logger");

async function loadCSV(filePath) {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (const row of results) {
            await db.Customer.upsert({
              customerId: row["Customer ID"],
              name: row["Customer Name"],
              email: row["Customer Email"],
              address: row["Customer Address"],
            });

            await db.Product.upsert({
              productId: row["Product ID"],
              name: row["Product Name"],
              category: row["Category"],
              region: row["Region"],
            });

            await db.Order.upsert({
              orderId: row["Order ID"],
              productId: row["Product ID"],
              customerId: row["Customer ID"],
              dateOfSale: new Date(row["Date of Sale"]),
              quantitySold: parseInt(row["Quantity Sold"]),
              unitPrice: parseFloat(row["Unit Price"]),
              discount: parseFloat(row["Discount"]),
              shippingCost: parseFloat(row["Shipping Cost"]),
              paymentMethod: row["Payment Method"],
            });
          }
          logger.info("CSV loaded successfully.");
          resolve();
        } catch (err) {
          logger.error("Error loading CSV", err);
          reject(err);
        }
      });
  });
}

module.exports = { loadCSV };