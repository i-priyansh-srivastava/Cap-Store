const User = require('../Models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send user info without password
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userName: user.userName,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


exports.signInUser = async (req, res) => {
  try {
    const { name, email, userName, password, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !userName || !password) {
      return res.status(400).json({ 
        message: 'Name, email, username and password are required fields' 
      });
    }

    // Check if user already exists with email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { userName }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      userName,
      password: hashedPassword,
      phone,
      address
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userName: newUser.userName,
        phone: newUser.phone,
        address: newUser.address,
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'User registration failed', 
      error: error.message 
    });
  }
};