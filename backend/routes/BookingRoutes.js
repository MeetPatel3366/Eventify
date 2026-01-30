import express from "express";
import {
  createBooking,
  myBookings,
  getMyEventBookings,
  markBookingCheckedIn,
  exportBookingsCSV,
  getAllBookings,
  getBookingAnalytics,
  verifyBookingPayment,
  cancelBooking,
} from "../controllers/BookingController.js";
import {
  isLoggedIn,
  isEventOrganizer,
  isAdmin,
} from "../middleware/authMiddleware.js";
import {
  apiLimiter,
  checkinLimiter,
} from "../middleware/rateLimitMiddleware.js";
const router = express.Router();

router.post("/", apiLimiter, isLoggedIn, createBooking);

router.post("/verify", apiLimiter, isLoggedIn, verifyBookingPayment);

router.get("/my", apiLimiter, isLoggedIn, myBookings);

router.get("/all", apiLimiter, isLoggedIn, isAdmin, getAllBookings);

router.get("/analytics", apiLimiter, isLoggedIn, isAdmin, getBookingAnalytics);

router.post("/:bookingId/cancel", apiLimiter, isLoggedIn, cancelBooking);

router.get(
  "/:eventID",
  apiLimiter,
  isLoggedIn,
  isEventOrganizer,
  getMyEventBookings,
);

router.patch(
  "/:bookingId/check-in",
  isLoggedIn,
  isEventOrganizer,
  checkinLimiter,
  markBookingCheckedIn,
);

router.get(
  "/event/:eventId/export",
  apiLimiter,
  isLoggedIn,
  isEventOrganizer,
  exportBookingsCSV,
);

export default router;
