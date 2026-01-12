const Review = require("../models/ReviewModel");
const Booking = require("../models/BookingModel");
const Event = require("../models/EventModel");
const mongoose = require("mongoose");

const createReview = async (req, res) => {
  try {
    const { eventId, rating, review } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event Id format",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.datetime > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "You can only leave a review after the event has ended.",
      });
    }

    const booking = await Booking.findOne({
      userId,
      eventId,
      status: "confirmed",
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: "You can only review events you have attended.",
      });
    }

    const existing = await Review.findOne({ userId, eventId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this event",
      });
    }

    const newReview = await Review.create({
      userId,
      eventId,
      rating,
      review,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
};
