const express = require("express");
const {
  createBooking,
  myBookings,
  getMyEventBookings,
  markBookingCheckedIn,
  exportBookingsCSV,
  getAllBookings,
  getBookingAnalytics,
  verifyBookingPayment,
} = require("../controllers/BookingController");
const {
  isLoggedIn,
  isEventOrganizer,
  isAdmin,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", isLoggedIn, createBooking);

router.post("/verify", isLoggedIn, verifyBookingPayment);

router.get("/my", isLoggedIn, myBookings);

router.get("/all", isLoggedIn, isAdmin, getAllBookings);

router.get("/analytics", isLoggedIn, isAdmin, getBookingAnalytics);

router.get("/:eventID", isLoggedIn, isEventOrganizer, getMyEventBookings);

router.patch(
  "/:bookingId/check-in",
  isLoggedIn,
  isEventOrganizer,
  markBookingCheckedIn,
);

router.get(
  "/event/:eventId/export",
  isLoggedIn,
  isEventOrganizer,
  exportBookingsCSV,
);

module.exports = router;
