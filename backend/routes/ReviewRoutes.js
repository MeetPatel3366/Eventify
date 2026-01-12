const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { createReview } = require("../controllers/ReviewController");
const router = express.Router();

router.post("/create", isLoggedIn, createReview);

module.exports = router;
