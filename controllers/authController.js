const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password, role: 'learner' });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user.id, username, email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password, captcha } = req.body;
    console.log('Login attempt:', { username, password: '***', captcha });
    
    // Temporarily bypass captcha for debugging
    console.log('Captcha received:', captcha);
    
    const user = await User.findOne({ where: { username } });
    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User details:', {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password
      });
    }
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('Attempting password comparison...');
    console.log('Input password:', password);
    console.log('Stored password hash:', user.password);
    
    const passwordMatch = await user.comparePassword(password);
    console.log('Password match result:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Track successful captcha and login attempt
    // Note: Login attempts tracking would need separate tables in Sequelize
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    await user.update({ password: newPassword });
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMe = (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username, role: req.user.role } });
};

module.exports = { signup, login, changePassword, getMe };