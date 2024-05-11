const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
    length: 6, // Ensure 6-digit OTP
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 10 * 60 * 1000, // Expires in 10 minutes
  },
});

module.exports = mongoose.model('Otp', OtpSchema);