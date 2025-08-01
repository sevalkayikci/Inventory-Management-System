const db = require('../models');
const StockMovement = db.StockMovement;

exports.transferStock = async (req, res) => {
  try {
    const { product_id, from_location_id, to_location_id, quantity } = req.body;
    const qty = parseInt(quantity);

    if (!product_id || !from_location_id || !to_location_id || !qty) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
    }

    if (from_location_id === to_location_id) {
      return res.status(400).json({ message: 'Kaynak ve hedef depo aynı olamaz.' });
    }

    const [result] = await db.sequelize.query(`
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN movement_type = 'in' THEN quantity
              WHEN movement_type = 'out' THEN -quantity
              ELSE 0
            END
          ), 0
        ) AS current_stock
      FROM egc.stock_movements
      WHERE product_id = :product_id AND location_id = :from_location_id
    `, {
      replacements: { product_id, from_location_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    const currentStock = Number(result.current_stock);

    if (currentStock < qty) {
      return res.status(400).json({
        message: `Yetersiz stok! Mevcut: ${currentStock}, istenen: ${qty}`
      });
    }

    await StockMovement.create({
      product_id,
      location_id: from_location_id,
      quantity: qty,
      movement_type: 'out'
    });

    await StockMovement.create({
      product_id,
      location_id: to_location_id,
      quantity: qty,
      movement_type: 'in'
    });

    return res.status(201).json({ message: 'Transfer başarıyla gerçekleşti.' });

  } catch (err) {
    console.error('🔥 Transfer Hatası:', err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};
