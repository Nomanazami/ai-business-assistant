require('dotenv').config();
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Product = require('../models/Product');

// ⭐ Dashboard stats
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {

    // Total users count
    const totalUsers = await User.countDocuments();

    // Total chats count
    const totalChats = await Chat.countDocuments();

    // Total products count
    const totalProducts = await Product.countDocuments();

    // Total messages count
    const allChats = await Chat.find();
    let totalMessages = 0;
    allChats.forEach(chat => {
      totalMessages += chat.messages.length;
    });

    // Recent users — last 5
    const recentUsers = await User.find()
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Products list
    const products = await Product.find()
      .select('name price category rating');

    res.json({
      stats: {
        totalUsers,
        totalChats,
        totalProducts,
        totalMessages
      },
      recentUsers,
      products
    });

  } catch (err) {
    console.log("Stats error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;