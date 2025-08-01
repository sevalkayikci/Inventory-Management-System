const db = require('../models');
const Product = db.Product;

/**
 * Tüm ürünleri getir
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Yeni ürün oluştur (barkod dahil)
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, barcode, unit, price, min_threshold } = req.body;


    if (!name || !barcode) {
      return res.status(400).json({ message: 'Ürün adı ve barkod zorunludur' });
    }

    const existing = await Product.findOne({ where: { barcode } });
    if (existing) {
      return res.status(409).json({ message: 'Bu barkoda sahip bir ürün zaten var' });
    }

    const newProduct = await Product.create({ name, barcode, unit, price, min_threshold });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Ürünü güncelle
 */
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, barcode, unit, price, min_threshold } = req.body;



    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

    product.name = name || product.name;
    product.barcode = barcode || product.barcode;
    product.unit = unit || product.unit;
    product.price = price || product.price;
    product.min_threshold = min_threshold || product.min_threshold;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Ürünü sil
 */
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

    await product.destroy();
    res.json({ message: 'Ürün silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Barkoda göre ürün bul (barkodla arama)
 */
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await Product.findOne({ where: { barcode } });

    if (!product) {
      return res.status(404).json({ message: 'Bu barkod ile eşleşen ürün bulunamadı' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.getProductsWithStock = async (req, res) => {
  try {
    const products = await db.StockMovement.findAll({
      attributes: [
        'product_id',
        [
          db.Sequelize.literal(`
            SUM(
              CASE 
                WHEN movement_type = 'in' THEN quantity
                WHEN movement_type = 'out' THEN -quantity
                ELSE 0
              END
            )
          `),
          'quantity'
        ]
      ],
      include: [
        {
          model: db.Product,
          attributes: ['id', 'name', 'unit']
        }
      ],
      group: ['product_id', 'Product.id', 'Product.name', 'Product.unit']
    });

    const result = products.map(p => ({
      id: p.Product.id,
      name: p.Product.name,
      unit: p.Product.unit,
      quantity: Number(p.get('quantity')) || 0
    }));

    res.json(result);
  } catch (err) {
    console.error('Stok hesaplama hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await db.StockMovement.findAll({
      attributes: [
        'product_id',
        [
          db.Sequelize.literal(`
            SUM(
              CASE 
                WHEN movement_type = 'in' THEN quantity
                WHEN movement_type = 'out' THEN -quantity
                ELSE 0
              END
            )
          `),
          'quantity'
        ]
      ],
      include: [
        {
          model: db.Product,
          attributes: ['id', 'name', 'unit', 'min_threshold']
        }
      ],
      group: [
        'product_id',
        'Product.id',
        'Product.name',
        'Product.unit',
        'Product.min_threshold'
      ],
      raw: true
    });

    // Her ürün için stok eşik kontrolü
    const result = products
      .filter(p => {
        const quantity = Number(p.quantity) || 0;
        const threshold = Number(p['Product.min_threshold']) || 0;
        return quantity <= threshold;
      })
      .map(p => ({
        id: p['Product.id'],
        name: p['Product.name'],
        unit: p['Product.unit'],
        quantity: Number(p.quantity) || 0,
        min_threshold: p['Product.min_threshold']
      }));

    res.json(result);
  } catch (err) {
    console.error('Low stock error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
