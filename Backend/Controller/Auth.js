const User = require('../Models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const JWT_SECRET =process.env.JWT_SECRET;

exports.loginUser = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log("hello")
    
    const token = jwt.sign(
      { id: user._id, email: user.email},
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful for user:', user.email);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


exports.signInUser = async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { name, email, password, userName, phone, address } = req.body;

    if (!name || !email || !userName || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, userName: !!userName, password: !!password });
      return res.status(400).json({ 
        message: 'Name, email, username and password are required fields' 
      });
    }

    // Check for existing user BEFORE creating new user
    const existingUser = await User.findOne({ 
      $or: [{ email }, { userName }] 
    });
    
    console.log('Existing user check:', existingUser ? 'Found existing user' : 'No existing user');
    
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const newUser = new User({
      name,
      userName,
      email,
      password, // Don't hash here - the pre-save middleware will do it
      phone,
      address
    });

    console.log('Attempting to save new user...');
    await newUser.save();
    console.log('User saved successfully');

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Signup successful for user:', newUser.email);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'User registration failed', 
      error: error.message 
    });
  }
};