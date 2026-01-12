const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createReview,
  getEventReviews,
  getMyReview,
  updateReview,
} = require("../controllers/ReviewController");
const router = express.Router();

router.post("/create", isLoggedIn, createReview);

router.get("/:eventId", isLoggedIn, getEventReviews);

router.get("/my/:eventId", isLoggedIn, getMyReview);

router.put("/:eventId", isLoggedIn, updateReview);

module.exports = router;
