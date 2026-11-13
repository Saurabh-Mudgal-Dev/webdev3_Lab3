const Product = require('../model/product');

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    if (sort) {
      const parts = sort.split(':');
      sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);

    res.json({
      data: products,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      total
    });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { stockAdjustment, ...updates } = req.body;
    let updateQuery = { ...updates };

    if (stockAdjustment !== undefined) {
      updateQuery.$inc = { stock: Number(stockAdjustment) };
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        ...(stockAdjustment < 0 ? { stock: { $gte: Math.abs(stockAdjustment) } } : {})
      },
      updateQuery,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(400).json({ error: 'Product not found or insufficient stock' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

