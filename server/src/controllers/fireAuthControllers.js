const admin = require("../config/fireBaseAdmin");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

exports.firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // 1️⃣ Token presence check
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token required",
      });
    }

    // 2️⃣ Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);

    const phone = decoded.phone_number;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number missing in token",
      });
    }

    // 3️⃣ Check if user already exists
    const user = await User.findOne({ phone });

    /**
     * 🚨 IMPORTANT:
     * OTP verification ≠ user registration
     * Do NOT create user here
     */
    if (!user) {
      return res.status(200).json({
        success: true,
        needsSignup: true,
        phone,
      });
    }

    // 4️⃣ Existing user → issue JWT
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("FIREBASE AUTH ERROR >>>", err.message);

    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};
