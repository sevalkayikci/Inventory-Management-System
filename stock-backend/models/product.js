module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    barcode: { type: DataTypes.STRING, allowNull: false, unique: true }, // 💥 eklendi
    unit: { type: DataTypes.STRING, defaultValue: "adet" },
    min_threshold: {
  type: DataTypes.INTEGER,
  defaultValue: 10
}

  }, {
    schema: 'egc',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};
