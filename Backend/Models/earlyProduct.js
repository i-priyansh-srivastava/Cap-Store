const mongoose = require('mongoose');

const earlyProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Unisex', 'Item']
  },
  availableSize: {
    type: [String],
    required: true
  },
  relatedPhotos: {
    type: [String],
    default: []
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const EarlyProduct = mongoose.model('EarlyProduct', earlyProductSchema);
module.exports = EarlyProduct;
