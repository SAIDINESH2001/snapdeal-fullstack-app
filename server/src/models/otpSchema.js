const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true, index: true },
  type: { type: String, enum: ["phone", "email"], required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0, max: 5 }
}, { timestamps: true });

otpSchema.index({ identifier: 1, type: 1 }, { unique: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("otps", otpSchema);