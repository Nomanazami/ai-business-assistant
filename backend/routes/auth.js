require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ⭐ REGISTER — naya account banao
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Register data:", { name, email, password });

    // Email pehle se hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email pehle se registered hai!"
      });
    }

    // Password encrypt karo
    const hashedPassword = await bcrypt.hash(password, 10);
    // 10 = kitni baar encrypt karo (zyada = zyada secure)

    // User banao
    const user = await User.create({
      name,
      email,
      password: hashedPassword  // encrypted password
    });

    // Token banao
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }  // 7 din mein expire
    );

    res.json({
      message: "Account ban gaya! ✅",
      token,
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
     console.log("Register error:", err.message); 
    res.status(500).json({ error: err.message });
  }
});

// ⭐ LOGIN — purana account
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // User dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Email nahi mila!"
      });
    }

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Password galat hai!"
      });
    }

    // Token banao
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "Login ho gaya! ✅",
      token,
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;