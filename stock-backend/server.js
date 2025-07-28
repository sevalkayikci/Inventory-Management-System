const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 5001;

sequelize.sync({ alter: true }).then(() => {
  console.log("Database bağlantısı başarılı");
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
  });
}).catch((err) => {
  console.error("Veritabanı bağlantı hatası:", err);
});
