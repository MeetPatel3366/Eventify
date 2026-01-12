const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createReview,
  getEventReviews,
} = require("../controllers/ReviewController");
const router = express.Router();

router.post("/create", isLoggedIn, createReview);

router.get("/:eventId", isLoggedIn, getEventReviews);

module.exports = router;
