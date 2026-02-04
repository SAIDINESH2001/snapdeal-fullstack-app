const Otp = require("../models/otpSchema");
const generateOtp = require("../utils/generateOtp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { sendOtpEmail } = require("../services/emailService");

exports.sendOtp = async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !value) {
      return res.status(400).json({ error: "type and value required" });
    }

    if (!["email", "phone"].includes(type)) {
      return res.status(400).json({ error: "Invalid type. Must be 'email' or 'phone'" });
    }

    const user = await User.findOne({ [type]: value });

    if (!user) {
      return res.status(404).json({
        error: "User not found. Please register first.",
        registered: false,
      });
    }

    const existingOtp = await Otp.findOne({ identifier: value, type });
    if (existingOtp && existingOtp.createdAt > Date.now() - 60000) {
      const waitTime = Math.ceil((60000 - (Date.now() - existingOtp.createdAt)) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitTime} seconds before requesting a new OTP`
      });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
      { identifier: value, type },
      {
        otpHash,
        expiresAt: Date.now() + 10 * 60 * 1000,
        attempts: 0
      },
      { upsert: true }
    );

    // Send OTP email asynchronously (fire-and-forget)
    // Don't await - let it send in background
    sendOtpEmail(user.email, otp, user.name)
      .then(() => {
        console.log(`OTP sent to ${user.email}:`, otp);
      })
      .catch((error) => {
        console.error('Email sending failed (background):', error.message || error);
      });

    // Return success immediately to user
    res.json({
      message: "OTP sent successfully to your registered email address",
      email: user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { type, value, otp } = req.body;

    if (!type || !value || !otp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["phone", "email"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: "Invalid OTP format. OTP must be 6 digits." });
    }

    const record = await Otp.findOne({ identifier: value, type });

    if (!record) {
      return res.status(400).json({ error: "OTP not found or has expired" });
    }

    if (record.expiresAt < Date.now()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (record.attempts >= 5) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(429).json({
        error: "Too many invalid attempts. Please request a new OTP."
      });
    }

    const isMatch = await bcrypt.compare(otp, record.otpHash);

    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      const remainingAttempts = 5 - record.attempts;
      return res.status(400).json({
        error: "Invalid OTP",
        remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
      });
    }

    await Otp.deleteOne({ _id: record._id });

    const user = await User.findOne({ [type]: value });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const role = user.role || "customer";
    const name = user.name;
    const id = user._id;

    const token = jwt.sign(
      { id, type, value, role, name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      type,
      value,
      role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};

exports.resendOtp = async (req, res) => {
  return exports.sendOtp(req, res);
};