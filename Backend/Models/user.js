const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: false,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Invalid phone number'],
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiryDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) 
    return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);  
module.exports = User;
