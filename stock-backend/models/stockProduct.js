// models/stockProduct.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("StockProduct", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    location_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  }, {
    schema: 'egc',
    tableName: 'stock_products',
    timestamps: false
  });
};
