const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createReview,
  getEventReviews,
  getMyReview,
  updateReview,
  deleteReview,
  getEventRatingSummary,
} = require("../controllers/ReviewController");
const router = express.Router();

router.post("/create", isLoggedIn, createReview);

router.get("/summary/:eventId", isLoggedIn, getEventRatingSummary);

router.get("/my/:eventId", isLoggedIn, getMyReview);

router.get("/:eventId", isLoggedIn, getEventReviews);

router.put("/:eventId", isLoggedIn, updateReview);

router.delete("/:eventId", isLoggedIn, deleteReview);

module.exports = router;
