import express from "express";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import { contactForm } from "../controllers/ContactMessageController.js";
import { apiLimiter } from "../middleware/rateLimitMiddleware.js";
const router = express.Router();

router.use(apiLimiter)

router.post("/", isLoggedIn, contactForm);

export default router;
