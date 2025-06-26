const Product = require('../../Models/product');

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Add product error:', err.message);
    res.status(400).json({ message: 'Failed to add product', error: err.message });
  }
};