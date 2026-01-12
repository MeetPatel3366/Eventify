const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createReview,
  getEventReviews,
  getMyReview,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");
const router = express.Router();

router.post("/create", isLoggedIn, createReview);

router.get("/:eventId", isLoggedIn, getEventReviews);

router.get("/my/:eventId", isLoggedIn, getMyReview);

router.put("/:eventId", isLoggedIn, updateReview);

router.delete("/:eventId", isLoggedIn, deleteReview);

module.exports = router;
