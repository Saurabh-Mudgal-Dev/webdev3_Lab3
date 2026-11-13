const validateProduct = (req, res, next) => {
  const { name, sku, category, price, stock } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  if (!sku || typeof sku !== 'string') {
    return res.status(400).json({ error: 'SKU is required and must be a string' });
  }
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Category is required and must be a string' });
  }
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price must be a non-negative number' });
  }
  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ error: 'Stock must be a non-negative number' });
  }

  next();
};

const validateStockAdjustment = (req, res, next) => {
  const { stockAdjustment } = req.body;

  if (stockAdjustment !== undefined && typeof stockAdjustment !== 'number') {
    return res.status(400).json({ error: 'Stock adjustment must be a number' });
  }

  next();
};

module.exports = {
  validateProduct,
  validateStockAdjustment
};

