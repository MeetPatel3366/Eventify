const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "all fields required",
    });
  }

  const exist = await User.findOne({ email });
  if (exist) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ email, password: hashedPassword, role });

  res.status(201).json({
    success: true,
    message: "registration successfully",
  });
};

const login = async (req, res) => {
  console.log("loggin start");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "invalid email and password",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "invalid email and password",
    });
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    return res.status(400).json({
      success: false,
      message: "invalid email and password",
    });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, "secret");

  return res.status(200).json({
    success: true,
    message: "login successful",
    role: user.role,
    token,
  });
};

const verify = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: false,
    });
  }

  const decoded = jwt.verify(token, "secret");
  return res.status(200).json({
    success: true,
    role: decoded.role,
  });
};
module.exports = { register, login, verify };
