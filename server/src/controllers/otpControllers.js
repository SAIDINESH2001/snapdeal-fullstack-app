const Otp = require("../models/otpSchema");
const generateOtp = require("../utils/generateOtp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/userSchema')

exports.sendOtp = async (req, res) => {
  const { type, value } = req.body;

  if (!type || !value)
    return res.status(400).json({ error: "type and value required" });

  if (!["email", "phone"].includes(type))
    return res.status(400).json({ error: "Invalid type" });

  const identifier = value;

  const otp = generateOtp();               
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.findOneAndUpdate(
    { identifier, type },
    {
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    },
    { upsert: true }
  );

  console.log("OTP:", otp); 

  res.json({ message: "OTP sent" });
};


exports.verifyOtp = async (req, res) => {
  const { type, value, otp } = req.body;

  if (!type || !value || !otp)
    return res.status(400).json({ error: "Missing required fields" });

  if (!["phone", "email"].includes(type))
    return res.status(400).json({ error: "Invalid type" });

  if (!/^\d{6}$/.test(otp))
    return res.status(400).json({ error: "Invalid OTP format" });

  const record = await Otp.findOne({ identifier: value, type });

  if (!record)
    return res.status(400).json({ error: "OTP not found or expired" });

  if (record.expiresAt < Date.now()) {
    await Otp.deleteOne({ _id: record._id });
    return res.status(400).json({ error: "OTP expired" });
  }

  if (record.attempts >= 5)
    return res.status(429).json({ error: "Too many attempts" });

  const isMatch = await bcrypt.compare(otp, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ error: "Invalid OTP" });
  }

  await Otp.deleteOne({ _id: record._id });
  const user = await User.findOne({[type]: value});
  const role = user?.role || "customer";
  const name = user?.name;
  const token = jwt.sign(
    { type, value, role,name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ token , type, value, role, user});
};
