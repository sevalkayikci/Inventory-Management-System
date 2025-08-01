const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getAllStockMovements);
router.post('/', stockController.createStockMovement);
router.get('/history', stockController.getProductHistory);
module.exports = router;
