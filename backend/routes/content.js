require('dotenv').config();
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/authMiddleware');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ⭐ Content generate karo
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { productName, platform, tone, description } = req.body;

    // ⭐ AI ko instructions do
    const prompt = `
Tum ek expert marketing copywriter ho.

Product: ${productName}
Description: ${description}
Platform: ${platform}
Tone: ${tone}

Yeh generate karo JSON format mein:
{
  "caption": "Main caption yahan",
  "adCopy": "Full ad copy yahan",
  "whatsappMessage": "WhatsApp message yahan",
  "hashtags": "#tag1 #tag2 #tag3",
  "callToAction": "CTA yahan"
}

Rules:
- Roman Urdu + English mix use karo
- Platform ke hisaab se likho
- Tone bilkul ${tone} rakho
- Emojis use karo
- Sirf JSON return karo — kuch aur nahi
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    // ⭐ JSON parse karo
    const rawText = response.choices[0].message.content;
    const cleanText = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const content = JSON.parse(cleanText);
    res.json(content);

  } catch (err) {
    console.log("Content error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;