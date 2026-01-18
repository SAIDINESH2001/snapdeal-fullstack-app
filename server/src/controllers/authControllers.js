const User = require("../models/userSchema");

exports.getMe = async (req, res) => {
  const { type, value } = req.user;

  const user = await User.findOne({
    [type]: value,
  }).select("-password");

  if (!user)
    return res.status(404).json({ error: "User not found" });

  res.json({ user });
};
