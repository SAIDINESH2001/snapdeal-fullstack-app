const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendOtp = async (req, res, next) => {
  try {
    let { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number required",
      });
    }

    if (!phone.startsWith("+")) {
      phone = "+91" + phone;
    }

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    return res.json({
      success: true,
      message: "OTP sent",
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    let { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP required",
      });
    }

    let normalizedPhone = phone;

    if (!normalizedPhone.startsWith("+")) {
      normalizedPhone = "+91" + normalizedPhone;
    }

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: normalizedPhone,
        code: otp,
      });

    if (verification.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "OTP verified",
      token,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
