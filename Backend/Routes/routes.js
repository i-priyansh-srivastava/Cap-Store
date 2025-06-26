const express = require('express');
const router = express.Router();

const {loginUser , signInUser} = require('../Controller/Auth');
const {getAllProducts} = require('../Controller/GetProduct');
const { addToCart, getCartByUser } = require('../Controller/AddToCart');
const { addToWishlist, getWishlistByUser } = require('../Controller/WishlistController');
const { getUserDetails, updateUserDetails } = require('../Controller/MyAccountController');

const { addProduct } = require('../Controller/Admin/AddProduct');


router.post('/auth/login', loginUser);
router.post('/auth/signin', signInUser);
router.get('/getProducts', getAllProducts)
router.post('/cart/:id', addToCart)
router.get('/cart/:id', getCartByUser)
router.post('/wishlist/:id', addToWishlist)
router.get('/wishlist/:id', getWishlistByUser)
router.get('/user/:id', getUserDetails)
router.put('/user/:id', updateUserDetails)


// ADMIN ROUTES
router.post('/addProducts' , addProduct);

module.exports = router;