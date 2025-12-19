const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
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

const isAdmin = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(403).json({
      success: false,
      message: "admin only",
    });
  }
  next();
};

const isEventOrganizer = (req, res, next) => {
  if (req.user.role != "eventorganizer") {
    return res.status(403).json({
      success: false,
      message: "event organizer only",
    });
  }
  next();
};

const isAdminOrOrganizer = (req, res, next) => {
  const role = req.user.role;
  if (role == "admin" || role == "eventorganizer") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "only Admin or Event Organizer allowed",
  });
};

module.exports = { isLoggedIn, isAdmin, isEventOrganizer, isAdminOrOrganizer };
