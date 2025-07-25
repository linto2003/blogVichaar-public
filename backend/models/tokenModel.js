const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  token: {
    type: String,
    required: true,
    unique: true,
  },

  deviceInfo: {
    browser: String,
    os: String,
    platform: String,
    source: String, 
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
