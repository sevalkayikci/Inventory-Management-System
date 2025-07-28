const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/barcode/:barcode', productController.getProductByBarcode); // 📌 barkodla arama
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/with-stock', productController.getProductsWithStock);
router.get('/low-stock', productController.getLowStockProducts);

module.exports = router;
