const Product = require('../../Models/product');
const Order = require('../Models/order');

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

exports.reduceStockCount = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (product.stockCount <= 0) {
      return res.status(400).json({ message: 'Product out of stock.' });
    }
    product.stockCount -= 1;
    await product.save();
    res.status(200).json({ message: 'Stock reduced by 1', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reduce stock', error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentId } = req.body;
    if (!userId || !products || !totalAmount) {
      return res.status(400).json({ message: 'Missing required order fields.' });
    }
    const order = new Order({ user: userId, products, totalAmount, paymentId });
    await order.save();
    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).populate('products.product').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};