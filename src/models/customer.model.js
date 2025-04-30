module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Customer", {
    customerId: { type: DataTypes.STRING, primaryKey: true },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
  });
};