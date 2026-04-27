const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { username, email, password, role } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'All fields are required' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false,
          message: 'Please provide a valid email address' 
        });
      }

      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'Username already exists' 
        });
      }

      // Check if email already exists
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already exists' 
        });
      }

      const userId = await User.create({ username, email, password, role: role || 'customer' });
      
      const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        token,
        user: { userId, username, email, role: role || 'customer' }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Registration failed. Please try again.' 
      });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await User.validatePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getMe(req, res) {
    res.json(req.user);
  }
}

module.exports = AuthController;
