const User = require('../Models/user');

// Subscribe user to premium
exports.subscribeToPremium = async (req, res) => {
  try {
    console.log('Premium subscription request:', req.body);
    const { userId, paymentId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Set premium status and expiry date (1 year from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    user.isPremium = true;
    user.premiumExpiryDate = expiryDate;

    await user.save();

    console.log('User upgraded to premium:', user.email, 'Expires:', expiryDate);

    res.status(200).json({
      message: 'Successfully subscribed to premium!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumExpiryDate: user.premiumExpiryDate
      }
    });
  } catch (error) {
    console.error('Premium subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe to premium', error: error.message });
  }
};

// Check premium status
exports.checkPremiumStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if premium has expired
    if (user.isPremium && user.premiumExpiryDate && new Date() > user.premiumExpiryDate) {
      user.isPremium = false;
      user.premiumExpiryDate = null;
      await user.save();
      console.log('Premium expired for user:', user.email);
    }

    res.status(200).json({
      isPremium: user.isPremium,
      premiumExpiryDate: user.premiumExpiryDate,
      daysRemaining: user.isPremium && user.premiumExpiryDate 
        ? Math.ceil((user.premiumExpiryDate - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    });
  } catch (error) {
    console.error('Check premium status error:', error);
    res.status(500).json({ message: 'Failed to check premium status', error: error.message });
  }
};

// Cancel premium subscription
exports.cancelPremium = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isPremium = false;
    user.premiumExpiryDate = null;
    await user.save();

    console.log('Premium cancelled for user:', user.email);

    res.status(200).json({
      message: 'Premium subscription cancelled successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Cancel premium error:', error);
    res.status(500).json({ message: 'Failed to cancel premium', error: error.message });
  }
}; 