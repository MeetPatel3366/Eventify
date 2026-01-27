import express from "express";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import { contactForm } from "../controllers/ContactMessageController.js";
const router = express.Router();

router.post("/", isLoggedIn, contactForm);

export default router;
