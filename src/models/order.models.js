module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Order", {
    orderId: { type: DataTypes.STRING, primaryKey: true },
    dateOfSale: DataTypes.DATE,
    quantitySold: DataTypes.INTEGER,
    unitPrice: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    shippingCost: DataTypes.FLOAT,
    paymentMethod: DataTypes.STRING,
  });
};