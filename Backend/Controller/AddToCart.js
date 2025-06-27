const Cart = require('../Models/cartSchema');
const Product = require('../Models/product');
const EarlyProduct = require('../Models/earlyProduct');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required.' });
    }

    // Check if product exists in regular products
    let product = await Product.findById(productId);
    let isEarlyAccessProduct = false;
    
    // If not found in regular products, check early access products
    if (!product) {
      product = await EarlyProduct.findById(productId);
      isEarlyAccessProduct = true;
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if product is in stock
    if (product.stockCount <= 0) {
      return res.status(400).json({ message: 'Product is out of stock.' });
    }

    // Check if requested quantity is available
    if (product.stockCount < quantity) {
      return res.status(400).json({ 
        message: `Only ${product.stockCount} items available in stock.` 
      });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create a new cart for the user
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, isEarlyAccessProduct }]
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        // Check if adding more would exceed stock
        const newTotalQuantity = cart.items[itemIndex].quantity + quantity;
        if (newTotalQuantity > product.stockCount) {
          return res.status(400).json({ 
            message: `Cannot add more items. Only ${product.stockCount} items available in stock.` 
          });
        }
        // Update quantity
        cart.items[itemIndex].quantity = newTotalQuantity;
      } else {
        // Add new product to cart
        cart.items.push({ product: productId, quantity, isEarlyAccessProduct });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add product to cart', error: error.message });
  }
};

// Controller to fetch all cart products for a user
exports.getCartByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    // Manually populate products from both models
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        let product;
        if (item.isEarlyAccessProduct) {
          product = await EarlyProduct.findById(item.product);
        } else {
          product = await Product.findById(item.product);
        }
        return {
          ...item.toObject(),
          product: product
        };
      })
    );

    const populatedCart = {
      ...cart.toObject(),
      items: populatedItems
    };

    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

// Controller to update cart item quantity
exports.updateCartItemQuantity = async (req, res) => {
  try {
    console.log('Update cart quantity called with:', req.params, req.body);
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      console.log('Missing required fields:', { productId, quantity });
      return res.status(400).json({ message: 'Product ID and quantity are required.' });
    }

    if (quantity < 0) {
      console.log('Invalid quantity:', quantity);
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }

    console.log('Looking for cart with userId:', userId);
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      console.log('Cart not found for user:', userId);
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    console.log('Cart found, looking for product:', productId);
    // Find the item in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      console.log('Product not found in cart:', productId);
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    console.log('Product found at index:', itemIndex, 'Current quantity:', cart.items[itemIndex].quantity, 'New quantity:', quantity);

    if (quantity === 0) {
      // Remove item if quantity is 0
      console.log('Removing item from cart');
      cart.items.splice(itemIndex, 1);
    } else {
      // Check if product is still in stock (check both models)
      let product = await Product.findById(productId);
      if (!product) {
        product = await EarlyProduct.findById(productId);
      }
      
      if (!product) {
        console.log('Product not found in database:', productId);
        return res.status(404).json({ message: 'Product not found.' });
      }

      if (product.stockCount < quantity) {
        console.log('Insufficient stock:', product.stockCount, 'requested:', quantity);
        return res.status(400).json({ 
          message: `Only ${product.stockCount} items available in stock.` 
        });
      }

      // Update quantity
      console.log('Updating quantity from', cart.items[itemIndex].quantity, 'to', quantity);
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    console.log('Cart saved successfully');
    
    // Manually populate products for response
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        let product;
        if (item.isEarlyAccessProduct) {
          product = await EarlyProduct.findById(item.product);
        } else {
          product = await Product.findById(item.product);
        }
        return {
          ...item.toObject(),
          product: product
        };
      })
    );

    const populatedCart = {
      ...cart.toObject(),
      items: populatedItems
    };
    
    console.log('Cart populated, sending response');
    
    res.status(200).json({ 
      message: quantity === 0 ? 'Product removed from cart' : 'Cart updated successfully', 
      cart: populatedCart
    });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
};

// Controller to remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    console.log('Remove from cart called with:', req.params, req.body);
    const userId = req.params.id;
    const { productId } = req.body;

    if (!productId) {
      console.log('Product ID missing');
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    console.log('Looking for cart with userId:', userId);
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      console.log('Cart not found for user:', userId);
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    console.log('Cart found, looking for product:', productId);
    // Find and remove the item from cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      console.log('Product not found in cart:', productId);
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    console.log('Product found at index:', itemIndex, 'removing...');
    cart.items.splice(itemIndex, 1);
    await cart.save();
    console.log('Cart saved successfully');
    
    // Manually populate products for response
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        let product;
        if (item.isEarlyAccessProduct) {
          product = await EarlyProduct.findById(item.product);
        } else {
          product = await Product.findById(item.product);
        }
        return {
          ...item.toObject(),
          product: product
        };
      })
    );

    const populatedCart = {
      ...cart.toObject(),
      items: populatedItems
    };
    
    console.log('Cart populated, sending response');
    
    res.status(200).json({ message: 'Product removed from cart', cart: populatedCart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove product from cart', error: error.message });
  }
};

// Controller to clear cart for a user (after successful payment)
exports.clearCart = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Clearing cart for user:', userId);
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      console.log('Cart not found for user:', userId);
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    console.log('Cart found, items before clearing:', cart.items.length);
    // Clear all items from cart
    cart.items = [];
    await cart.save();
    console.log('Cart cleared successfully');
    
    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};
