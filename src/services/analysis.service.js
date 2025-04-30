const { Op, Sequelize } = require('sequelize');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Product = require('../models/product.model');

async function calculateTotalRevenue(startDate, endDate) {
  const result = await OrderItem.findAll({
    include: [{ model: Order, where: { dateOfSale: { [Op.between]: [startDate, endDate] } } }],
    attributes: [
      [Sequelize.fn(
        'SUM',
        Sequelize.literal('(unitPrice * quantity) * (1 - discount)')
      ), 'totalRevenue']
    ]
  });
  return result[0].dataValues.totalRevenue || 0;
}

async function totalRevenueByProduct(startDate, endDate) {
  const result = await OrderItem.findAll({
    include: [
      { model: Order, where: { dateOfSale: { [Op.between]: [startDate, endDate] } } },
      { model: Product }
    ],
    attributes: [
      'ProductId',
      [Sequelize.fn(
        'SUM',
        Sequelize.literal('(unitPrice * quantity) * (1 - discount)')
      ), 'revenue']
    ],
    group: ['ProductId']
  });
  return result;
}

async function totalRevenueByCategory(startDate, endDate) {
  const result = await OrderItem.findAll({
    include: [
      { model: Order, where: { dateOfSale: { [Op.between]: [startDate, endDate] } } },
      { model: Product }
    ],
    attributes: [
      [Sequelize.col('Product.category'), 'category'],
      [Sequelize.fn(
        'SUM',
        Sequelize.literal('(unitPrice * quantity) * (1 - discount)')
      ), 'revenue']
    ],
    group: ['Product.category']
  });
  return result;
}

async function totalRevenueByRegion(startDate, endDate) {
  const result = await Order.findAll({
    where: { dateOfSale: { [Op.between]: [startDate, endDate] } },
    attributes: [
      'region',
      [Sequelize.fn(
        'SUM',
        Sequelize.literal('(unitPrice * quantitySold) * (1 - discount)')
      ), 'revenue']
    ],
    group: ['region']
  });
  return result;
}

module.exports = {
  calculateTotalRevenue,
  totalRevenueByProduct,
  totalRevenueByCategory,
  totalRevenueByRegion
};