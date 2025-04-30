module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Product", {
    productId: { type: DataTypes.STRING, primaryKey: true },
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    region: DataTypes.STRING,
  });
};
