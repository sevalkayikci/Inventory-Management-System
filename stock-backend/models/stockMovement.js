module.exports = (sequelize, DataTypes) => {
  return sequelize.define("StockMovement", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    location_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    movement_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['in', 'out', 'transfer']]
      }
    }
  }, {
    schema: 'egc',
    tableName: 'stock_movements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};
