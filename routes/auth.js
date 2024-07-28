const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: "Authentication route is working" });
});

// Root route for /api/auth
router.get('/', (req, res) => {
  res.json({ message: "Welcome to the authentication routes" });
});

router.post('/register', async (req, res) => {
  console.log('Registration attempt received:', req.body);
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    console.log('User registered successfully:', user._id);
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  console.log('Login attempt received:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    console.log('Stored hashed password:', user.password);
    console.log('Provided password:', password);
    
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful, sending response');
    res.json({ 
      message: 'Login successful',
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, refreshToken: newRefreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token', error: error.message });
  }
});

router.put('/update-profile', auth, async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, profileImage },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
});


router.post('/create-user', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admins can create new users' });
    }

    console.log('Creating new user:', req.body);
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    console.log('New user created successfully:', user._id);
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

module.exports = router;