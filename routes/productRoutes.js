const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controller/productController');
const {
  validateProduct,
  validateStockAdjustment
} = require('../middleware/validate');

router.post('/', validateProduct, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', validateStockAdjustment, updateProduct);
router.patch('/:id', validateStockAdjustment, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
