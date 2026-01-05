const express = require("express");
const { createBooking } = require("../controllers/BookingController");
const { isLoggedIn } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", isLoggedIn, createBooking);

module.exports = router;
