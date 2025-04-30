const db = require("../models");
const { Op } = require("sequelize");

exports.totalRevenueByRegion = async (req, res) => {
  const { start, end } = req.query;
  try {
    const results = await db.Order.findAll({
      include: [{ model: db.Product, attributes: ["region"] }],
      attributes: [
        [
          db.Sequelize.fn(
            "sum",
            db.Sequelize.literal("\"quantitySold\" * \"unitPrice\" * (1 - \"discount\")")
          ),
          "totalRevenue",
        ],
      ],
      where: {
        dateOfSale: {
          [Op.between]: [new Date(start), new Date(end)],
        },
      },
      group: ["Product.region"],
      raw: true,
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Error calculating revenue" });
  }
};