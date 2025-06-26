const Wishlist = require('../Models/wishlist');
const Product = require('../Models/product');

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(200).json({ message: 'Product already in wishlist.', wishlist });
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Failed to add product to wishlist', error: error.message });
  }
};

exports.getWishlistByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found for this user.' });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Fetch wishlist error:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist', error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found for this user.' });
    }

    const productIndex = wishlist.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist.' });
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();
    res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Failed to remove product from wishlist', error: error.message });
  }
}; 