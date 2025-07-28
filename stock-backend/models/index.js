const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modeller
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Product = require("./product")(sequelize, Sequelize.DataTypes);
db.Location = require("./location")(sequelize, Sequelize.DataTypes);
db.StockMovement = require("./stockMovement")(sequelize, Sequelize.DataTypes);
db.StockProduct = require("./stockProduct")(sequelize, Sequelize.DataTypes);

// İlişkiler
db.Product.hasMany(db.StockProduct, { foreignKey: 'product_id' });
db.Location.hasMany(db.StockProduct, { foreignKey: 'location_id' });
db.StockProduct.belongsTo(db.Product, { foreignKey: 'product_id' });
db.StockProduct.belongsTo(db.Location, { foreignKey: 'location_id' });

db.Product.hasMany(db.StockMovement, { foreignKey: "product_id" });
db.Location.hasMany(db.StockMovement, { foreignKey: "location_id" });
db.StockMovement.belongsTo(db.Product, { foreignKey: "product_id" });
db.StockMovement.belongsTo(db.Location, { foreignKey: "location_id" });

module.exports = db;
