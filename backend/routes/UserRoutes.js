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

export default router;
