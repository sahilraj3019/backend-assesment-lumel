const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require("./customer.model.js")(sequelize, DataTypes);
db.Product = require("./product.model.js")(sequelize, DataTypes);
db.Order = require("./order.model.js")(sequelize, DataTypes);

// Relationships
db.Customer.hasMany(db.Order, { foreignKey: "customerId" });
db.Product.hasMany(db.Order, { foreignKey: "productId" });
db.Order.belongsTo(db.Customer, { foreignKey: "customerId" });
db.Order.belongsTo(db.Product, { foreignKey: "productId" });

module.exports = db;