const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token ", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "access denied. no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token : ", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { isLoggedIn };
