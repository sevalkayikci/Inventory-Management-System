const db = require('../models');
const Location = db.Location;
const StockMovement = db.StockMovement;
const Product = db.Product;

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Lokasyon adı gerekli' });

    const existing = await Location.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Lokasyon zaten var' });

    const newLocation = await Location.create({ name });
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ message: 'Lokasyon bulunamadı' });

    location.name = name || location.name;
    await location.save();

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const id = req.params.id;
    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ message: 'Lokasyon bulunamadı' });

    await location.destroy();
    res.json({ message: 'Lokasyon silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.getProductsByLocation = async (req, res) => {
  try {
    const locationId = req.params.id;

    const stockMovements = await StockMovement.findAll({
      where: { location_id: locationId },
      include: [{ model: Product }]
    });

    const productMap = {};

    stockMovements.forEach(movement => {
      const product = movement.Product;
      if (!product) return;

      const id = product.id;
      const quantityChange = movement.movement_type === 'in' ? movement.quantity : -movement.quantity;

      if (!productMap[id]) {
        productMap[id] = {
          id: product.id,
          name: product.name,
          unit: product.unit,
          barcode: product.barcode,
          total_quantity: quantityChange
        };
      } else {
        productMap[id].total_quantity += quantityChange;
      }
    });

    const productList = Object.values(productMap);
    res.json(productList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ürünler alınamadı' });
  }
};
