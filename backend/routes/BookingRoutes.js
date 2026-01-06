const express = require("express");
const {
  createBooking,
  myBookings,
  getMyEventBookings,
  markBookingCheckedIn,
} = require("../controllers/BookingController");
const {
  isLoggedIn,
  isEventOrganizer,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", isLoggedIn, createBooking);

router.get("/my", isLoggedIn, myBookings);

router.get("/:eventID", isLoggedIn, isEventOrganizer, getMyEventBookings);

router.patch(
  "/:bookingId/check-in",
  isLoggedIn,
  isEventOrganizer,
  markBookingCheckedIn
);

module.exports = router;
