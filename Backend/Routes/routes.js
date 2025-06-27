const express = require('express');
const router = express.Router();

const {loginUser , signInUser} = require('../Controller/Auth');
const {getAllProducts, getEarlyAccessProducts, getEarlyAccessProductById, getRelatedProducts} = require('../Controller/GetProduct');
const { addToCart, getCartByUser, clearCart, updateCartItemQuantity, removeFromCart } = require('../Controller/AddToCart');
const { addToWishlist, getWishlistByUser, removeFromWishlist } = require('../Controller/WishlistController');
const { getUserDetails, updateUserDetails } = require('../Controller/MyAccountController');
const { subscribeToPremium, checkPremiumStatus, cancelPremium } = require('../Controller/PremiumController');

const { addProduct, reduceStockCount, earlyAccess } = require('../Controller/Admin/AddProduct');
const { createOrder, getOrdersByUser, getAllOrders, getOrderById } = require('../Controller/OrderController');


router.post('/auth/login', loginUser);
router.post('/auth/signin', signInUser);
router.get('/getProducts', getAllProducts)
router.get('/getEarlyAccessProducts', getEarlyAccessProducts)
router.get('/getEarlyAccessProduct/:id', getEarlyAccessProductById)

// CART ROUTES - More specific routes first
router.post('/cart/remove/:id', removeFromCart)
router.post('/cart/:id', addToCart)
router.get('/cart/:id', getCartByUser)
router.put('/cart/:id', updateCartItemQuantity)
router.delete('/cart/:id', clearCart)

router.post('/wishlist/:id', addToWishlist)
router.get('/wishlist/:id', getWishlistByUser)
router.post('/wishlist/remove/:id', removeFromWishlist)
router.get('/user/:id', getUserDetails)
router.put('/user/:id', updateUserDetails)

// PREMIUM ROUTES
router.post('/premium/subscribe', subscribeToPremium)
router.get('/premium/status/:userId', checkPremiumStatus)
router.delete('/premium/cancel/:userId', cancelPremium)

// ADMIN ROUTES
router.post('/addProducts' , addProduct);
router.post('/product/reduce-stock', reduceStockCount);
router.post('/earlyAccess' , earlyAccess);


// ORDER ROUTES
router.post('/order', createOrder);
router.get('/orders', getAllOrders);
router.get('/orders/:userId', getOrdersByUser);
router.get('/order/:orderId', getOrderById);

router.get('/relatedProducts/:id', getRelatedProducts);

module.exports = router;