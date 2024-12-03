const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
  // Register a new user
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, year, section } = req.body;

      // Validate input fields
      // if (!firstName || !lastName || !email || !password || !year || !section) {
      //   return res.status(400).json({ message: 'All fields are required' });
      // }

      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        year,
        section
      });

      // Remove sensitive data from the response
      const userWithoutPassword = { ...user.toJSON() };
      delete userWithoutPassword.password;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input fields
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Remove password from the user object before sending the response
      const userWithoutPassword = { ...user.toJSON() };
      delete userWithoutPassword.password;

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your_secret_key', // Use environment variable for security
        { expiresIn: '1h' } // Token expiration time
      );

      res.status(200).json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all users (for admin purposes)
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const [updated] = await User.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedUser = await User.findByPk(req.params.id);
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = userController;
