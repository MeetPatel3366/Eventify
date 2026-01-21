const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  register,
  login,
  verify,
  verifyOtp,
  verifyLoginOtp,
  getGoogleLoginPage,
  getGoogleLoginCallback,
  logout,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/UserController");
const upload = require("../utils/multer");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/google", getGoogleLoginPage);

router.get("/google/callback", getGoogleLoginCallback);

router.post("/verify-otp", verifyOtp);

router.post("/verify-login-otp", verifyLoginOtp);

router.get("/verify", verify);

router.get("/me", isLoggedIn, getMyProfile);

router.put("/me", upload.single("profileImage"), isLoggedIn, updateMyProfile);

router.get("/logout", logout);

module.exports = router;
