const Order = require('../Models/order');
const Product = require('../Models/product');
const EarlyProduct = require('../Models/earlyProduct');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    const { userId, products, totalAmount, deliveryCharge = 0, paymentId } = req.body;
    
    // Validate required fields
    if (!userId || !products || !totalAmount) {
      console.log('Missing required fields:', { userId, products: !!products, totalAmount });
      return res.status(400).json({ 
        message: 'Missing required order fields: userId, products, and totalAmount are required.' 
      });
    }

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      console.log('Invalid products array:', products);
      return res.status(400).json({ 
        message: 'Products must be a non-empty array.' 
      });
    }

    console.log('Validating products...');
    const orderProducts = [];
    for (const product of products) {
      console.log('Validating product:', product);
      if (!product.product || !product.quantity || !product.price) {
        console.log('Invalid product data:', product);
        return res.status(400).json({ 
          message: 'Each product must have product ID, quantity, and price.' 
        });
      }
      let productDoc = await Product.findById(product.product);
      let isEarlyAccessProduct = false;
      if (!productDoc) {
        productDoc = await EarlyProduct.findById(product.product);
        isEarlyAccessProduct = true;
      }
      if (!productDoc) {
        console.log('Product not found in either model:', product.product);
        return res.status(404).json({ 
          message: `Product with ID ${product.product} not found.` 
        });
      }
      console.log('Product found:', productDoc.productName || productDoc.name, 'Stock:', productDoc.stockCount, 'Requested:', product.quantity);
      if (productDoc.stockCount < product.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${productDoc.productName || productDoc.name}. Available: ${productDoc.stockCount}, Requested: ${product.quantity}` 
        });
      }
      orderProducts.push({
        product: product.product,
        quantity: product.quantity,
        price: product.price,
        isEarlyAccessProduct
      });
    }

    console.log('Creating order...');
    const order = new Order({ 
      user: userId, 
      products: orderProducts, 
      totalAmount, 
      deliveryCharge,
      paymentId 
    });
    
    await order.save();
    console.log('Order saved successfully:', order._id);

    console.log('Reducing stock...');
    for (const product of orderProducts) {
      let productModel;
      if (product.isEarlyAccessProduct) {
        productModel = EarlyProduct;
      } else {
        productModel = Product;
      }
      await productModel.findByIdAndUpdate(
        product.product,
        { $inc: { stockCount: -product.quantity } }
      );
      console.log('Stock reduced for product:', product.product, 'by:', product.quantity, 'EarlyAccess:', product.isEarlyAccessProduct);
    }

    await order.populate('products.product');
    console.log('Order populated successfully');

    res.status(201).json({ 
      message: 'Order created successfully', 
      order 
    });
  } catch (err) {
    console.error('Create order error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ 
      message: 'Failed to create order', 
      error: err.message 
    });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        message: 'User ID is required.' 
      });
    }

    const orders = await Order.find({ user: userId })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Orders retrieved successfully',
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('Get orders by user error:', err.message);
    res.status(500).json({ 
      message: 'Failed to fetch orders', 
      error: err.message 
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'All orders retrieved successfully',
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('Get all orders error:', err.message);
    res.status(500).json({ 
      message: 'Failed to fetch all orders', 
      error: err.message 
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ 
        message: 'Order ID is required.' 
      });
    }

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('products.product');

    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found.' 
      });
    }

    res.status(200).json({
      message: 'Order retrieved successfully',
      order
    });
  } catch (err) {
    console.error('Get order by ID error:', err.message);
    res.status(500).json({ 
      message: 'Failed to fetch order', 
      error: err.message 
    });
  }
};
