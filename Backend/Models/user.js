const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true
  },
  password: { 
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User; 