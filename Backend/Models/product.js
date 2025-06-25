const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId:{
        type: String,
        required: true,
    },

    productName:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    Price:{
        type: Number,
        required: true,
    },
    Rating:{
        type: Number,
        required: true,
    },
    Category:{
        type: String,
        required: true,

    },
    Tags:{
        type : String,
        required: true,
    }



})


const Products = mongoose.model('Products', productSchema);
module.exports = Products; 