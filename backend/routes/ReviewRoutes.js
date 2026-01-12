const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createReview,
  getEventReviews,
  getMyReview,
} = require("../controllers/ReviewController");
const router = express.Router();

router.post("/create", isLoggedIn, createReview);

router.get("/:eventId", isLoggedIn, getEventReviews);

router.get("/my/:eventId", isLoggedIn, getMyReview);

module.exports = router;
