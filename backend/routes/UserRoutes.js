import express from "express";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import {
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
} from "../controllers/UserController.js";
import upload from "../utils/multer.js";
import { apiLimiter, authLimiter } from "../middleware/rateLimitMiddleware.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", authLimiter, login);

router.get("/google", getGoogleLoginPage);

router.get("/google/callback", getGoogleLoginCallback);

router.post("/verify-otp", authLimiter, verifyOtp);

router.post("/verify-login-otp", authLimiter, verifyLoginOtp);

router.get("/verify", verify);

router.get("/me", apiLimiter, isLoggedIn, getMyProfile);

router.put(
  "/me",
  upload.single("profileImage"),
  apiLimiter,
  isLoggedIn,
  updateMyProfile,
);

router.get("/logout", logout);

export default router;
