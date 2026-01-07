const express = require("express");
const {
  createBooking,
  myBookings,
  getMyEventBookings,
  markBookingCheckedIn,
  exportBookingsCSV,
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

router.get("/event/:eventId/export",isLoggedIn,isEventOrganizer,exportBookingsCSV)

module.exports = router;
