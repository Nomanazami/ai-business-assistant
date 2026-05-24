const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true    // ek email = ek account
  },
  password: {
    type: String,
    required: true  // encrypted save hoga
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);