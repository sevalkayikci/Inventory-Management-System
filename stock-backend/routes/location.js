const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/', locationController.getAllLocations);
router.post('/', locationController.createLocation);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);
router.get('/:id/products', locationController.getProductsByLocation);

module.exports = router;
