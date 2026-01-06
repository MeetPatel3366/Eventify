const express = require("express");
const {
  createBooking,
  myBookings,
  getMyEventBookings,
} = require("../controllers/BookingController");
const {
  isLoggedIn,
  isEventOrganizer,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", isLoggedIn, createBooking);

router.get("/my", isLoggedIn, myBookings);

router.get(
  "/bookings/:eventID",
  isLoggedIn,
  isEventOrganizer,
  getMyEventBookings
);

module.exports = router;
