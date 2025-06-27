const Product = require('../Models/product');
const EarlyProduct = require('../Models/earlyProduct');
const mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

exports.getEarlyAccessProducts = async (req, res) => {
  try {
    const earlyProducts = await EarlyProduct.find({});
    res.status(200).json(earlyProducts);
  } catch (error) {
    console.error('Error fetching early access products:', error);
    res.status(500).json({ message: 'Failed to fetch early access products' });
  }
};

exports.getEarlyAccessProductById = async (req, res) => {
  try {
    const product = await EarlyProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Early access product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching early access product by ID:', error);
    res.status(500).json({ message: 'Failed to fetch early access product' });
  }
};

// Get 5 random related products (same category & gender, excluding current product)
exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, gender } = req.query;
    if (!category || !gender) {
      return res.status(400).json({ message: 'Category and gender are required' });
    }
    const related = await Product.aggregate([
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(id) }, category, gender } },
      { $sample: { size: 5 } }
    ]);
    res.status(200).json(related);
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ message: 'Failed to fetch related products' });
  }
};
