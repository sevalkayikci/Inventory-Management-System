const express = require("express");
const cors = require('cors');
const app = express();

// CORS ayarları
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Router'ları çek
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const stockMovementRouter = require("./routes/stock");
const locationRouter = require("./routes/location");
const transferRoutes = require('./routes/transfer');

// Router kullanımı
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/stock_movements", stockMovementRouter);
app.use("/api/locations", locationRouter);
app.use('/api/stock_transfer', transferRoutes);


// Test endpoint
app.get("/", (req, res) => {
  res.send("Stock Backend çalışıyor!");
});

module.exports = app;
