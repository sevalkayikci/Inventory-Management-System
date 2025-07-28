module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Location", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT }
  }, {
    schema: 'egc',
    tableName: 'locations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};
