import express from "express";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import {
  createReview,
  getEventReviews,
  getMyReview,
  updateReview,
  deleteReview,
  getEventRatingSummary,
} from "../controllers/ReviewController.js";
const router = express.Router();

router.post("/create", isLoggedIn, createReview);

router.get("/summary/:eventId", isLoggedIn, getEventRatingSummary);

router.get("/my/:eventId", isLoggedIn, getMyReview);

router.get("/:eventId", isLoggedIn, getEventReviews);

router.put("/:eventId", isLoggedIn, updateReview);

router.delete("/:eventId", isLoggedIn, deleteReview);

export default router;
