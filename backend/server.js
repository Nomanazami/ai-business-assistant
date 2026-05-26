require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Groq = require('groq-sdk');

const User = require('./models/User');
const Product = require('./models/Product');
const Chat = require('./models/Chat');
const authMiddleware = require('./middleware/authMiddleware');
const contentRoutes = require('./routes/content');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ⭐ MongoDB connect
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connect ho gaya!");
    await seedProducts();
  } catch (err) {
    console.log("❌ MongoDB error:", err);
  }
};

connectDB();

// ⭐ Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/stats', statsRoutes);

// ⭐ Business personality
const systemPrompt = `
Tum "Ahmed Perfume Shop" ke smart AI assistant ho.
Location: Karachi, Pakistan
- Customer ki zaroorat samjho
- Sahi product recommend karo
- Roman Urdu mein friendly baat karo
`;

// ⭐ Products — sab ke liye (login ki zaroorat nahi)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ⭐ Chat — sirf login users ke liye
app.post('/api/chat', authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;
    const userId = req.user.userId; // middleware se mila

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ]
    });

    const reply = response.choices[0].message.content;

    // Chat save karo — userId ke saath
    await Chat.findOneAndUpdate(
      { userId },
      {
        $push: {
          messages: [
            messages[messages.length - 1],
            { role: 'assistant', content: reply }
          ]
        }
      },
      { upsert: true, new: true }
    );

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ⭐ Seed products
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: "Arabian Oud", price: 2500, category: "oriental",
        description: "Rich aur luxurious eastern fragrance",
        tags: ["strong", "long-lasting", "masculine"], rating: 4.8, image: "🏺" },
      { name: "French Rose", price: 1800, category: "floral",
        description: "Romantic aur feminine rose fragrance",
        tags: ["soft", "feminine", "floral"], rating: 4.6, image: "🌹" },
      { name: "Musk Collection", price: 1200, category: "musk",
        description: "Clean aur fresh musk fragrance",
        tags: ["fresh", "clean", "unisex"], rating: 4.5, image: "✨" },
      { name: "Special Attar", price: 800, category: "attar",
        description: "Traditional Pakistani attar",
        tags: ["traditional", "affordable"], rating: 4.3, image: "🌿" },
      { name: "Blue Ocean", price: 2000, category: "aquatic",
        description: "Fresh aur cool ocean fragrance",
        tags: ["fresh", "cool", "masculine"], rating: 4.7, image: "🌊" },
      { name: "Vanilla Dreams", price: 1500, category: "sweet",
        description: "Sweet aur warm vanilla fragrance",
        tags: ["sweet", "warm", "feminine"], rating: 4.4, image: "🍦" }
    ]);
    console.log("✅ Products database mein save ho gaye!");
  } else {
    console.log("✅ Products pehle se hain!");
  }
};


app.listen(5000, () => {
  console.log("✅ Backend chal raha hai — Port 5000");
});