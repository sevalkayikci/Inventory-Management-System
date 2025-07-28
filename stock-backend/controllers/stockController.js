const db = require('../models');
const StockMovement = db.StockMovement;
const StockProduct = db.StockProduct;

exports.getAllStockMovements = async (req, res) => {
  try {
    const movements = await StockMovement.findAll();
    res.status(200).json(movements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};exports.createStockMovement = async (req, res) => {
  try {
    const { product_id, location_id, quantity, movement_type } = req.body;

    console.log("Gelen veri:", { product_id, location_id, quantity, movement_type });

    if (!product_id || !location_id || !quantity || !movement_type) {
      return res.status(400).json({ message: 'Eksik alan var' });
    }

    if (!['in', 'out'].includes(movement_type)) {
      return res.status(400).json({ message: 'Geçersiz hareket türü' });
    }

    const qty = parseInt(quantity);

    // ❗️ Yalnızca 'out' işlemi için stok kontrolü
    if (movement_type === 'out') {
      const result = await StockMovement.findAll({
        where: { product_id, location_id },
        attributes: [
          [db.Sequelize.literal(`
            SUM(
              CASE 
                WHEN movement_type = 'in' THEN quantity
                WHEN movement_type = 'out' THEN -quantity
                ELSE 0
              END
            )
          `), 'current_stock']
        ],
        raw: true
      });

      const currentStock = Number(result[0].current_stock) || 0;

      if (currentStock < qty) {
        return res.status(400).json({
          message: `Yetersiz stok! Mevcut: ${currentStock}, istenen: ${qty}`
        });
      }
    }

    // ✅ Stok hareketini kaydet
    await StockMovement.create({
      product_id,
      location_id,
      quantity: qty,
      movement_type
    });

    res.status(201).json({ message: 'Stok hareketi başarıyla kaydedildi!' });

  } catch (err) {
    console.error("🔥 Hata:", err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
