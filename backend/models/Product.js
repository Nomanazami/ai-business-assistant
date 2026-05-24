const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  tags: [String],
  rating: Number,
  image: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);