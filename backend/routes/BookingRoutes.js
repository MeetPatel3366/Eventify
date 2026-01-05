const express = require("express");
const {
  createBooking,
  myBookings,
} = require("../controllers/BookingController");
const { isLoggedIn } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", isLoggedIn, createBooking);

router.get("/my", isLoggedIn, myBookings);

module.exports = router;
