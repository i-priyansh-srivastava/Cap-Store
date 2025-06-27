const Product = require('../../Models/product');
const EarlyProduct = require('../../Models/earlyProduct');


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


exports.earlyAccess = async (req, res) => {
  try {
    console.log('=== EARLY ACCESS PRODUCT REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { productName, description, price, rating, category, tags, gender, availableSize } = req.body;
    
    console.log('Extracted fields:', {
      productName: !!productName,
      description: !!description,
      price: price,
      rating: rating,
      category: !!category,
      tags: tags,
      gender: gender,
      availableSize: availableSize
    });
    
    if (!productName || !description || !price || !rating || !category || !tags || !gender || !availableSize) {
      console.log('Missing required fields detected');
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide all required product information.',
        missing: {
          productName: !productName,
          description: !description,
          price: !price,
          rating: !rating,
          category: !category,
          tags: !tags,
          gender: !gender,
          availableSize: !availableSize
        }
      });
    }

    console.log('Creating EarlyProduct instance...');
    const earlyProduct = new EarlyProduct(req.body);
    console.log('EarlyProduct instance created:', earlyProduct);
    
    console.log('Saving to database...');
    const saved = await earlyProduct.save();
    console.log('Early access product saved successfully:', saved._id);
    
    res.status(201).json({
      message: 'Early access product added successfully',
      product: saved
    });
  } catch (err) {
    console.error('=== EARLY ACCESS PRODUCT ERROR ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Error name:', err.name);
    
    if (err.name === 'ValidationError') {
      console.error('Validation errors:', err.errors);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.keys(err.errors).map(key => ({
          field: key,
          message: err.errors[key].message
        }))
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to add early access product', 
      error: err.message 
    });
  }
};