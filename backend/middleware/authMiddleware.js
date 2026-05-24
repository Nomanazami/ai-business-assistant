const jwt = require('jsonwebtoken');

// ⭐ Yeh check karta hai — token sahi hai?
const authMiddleware = (req, res, next) => {

  // Header se token lo
  const token = req.header('Authorization');

  // Token hai?
  if (!token) {
    return res.status(401).json({
      error: "Token nahi hai — pehle login karo!"
    });
  }

  try {
    // Token verify karo
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET
    );

    // User info request mein add karo
    req.user = decoded;
    next(); // aage jao ✅

  } catch (err) {
    res.status(401).json({
      error: "Token galat hai!"
    });
  }
};

module.exports = authMiddleware;