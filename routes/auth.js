const express = require('express');
const { auth } = require('../middleware/auth');
const { signup, login, changePassword, getMe } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', auth, changePassword);
router.get('/me', auth, getMe);

// Test user creation route
router.post('/create-test-user', async (req, res) => {
  try {
    const User = require('../models/User');
    const testUser = new User({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });
    await testUser.save();
    res.json({ message: 'Test user created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;