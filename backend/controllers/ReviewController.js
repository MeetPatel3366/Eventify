const Review = require("../models/ReviewModel");
const Booking = require("../models/BookingModel");
const Event = require("../models/EventModel");
const mongoose = require("mongoose");

const createReview = async (req, res) => {
  try {
    const { eventId, rating, review } = req.body;
    const userId = req.user.id;

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

const getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event Id format",
      });
    }

    const reviews = await Review.find({ eventId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    if (reviews.length === 0) {
      const eventExists = await Event.exists({ _id: eventId });

      if (!eventExists) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyReview = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event Id format",
      });
    }

    const review = await Review.findOne({ userId, eventId })
      .populate("eventId", "name datetime image")
      .lean();

    if (!review) {
      return res.status(200).json({
        success: true,
        hasReviewed: false,
        message: "You have not reviewed this event yet.",
        review: null,
      });
    }

    return res.status(200).json({
      success: true,
      hasReviewed: true,
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const eventId = req.params;
    const userId = req.user.id;

    let updateData = {};

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event Id format",
      });
    }

    if (rating !== undefined) {
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      updateData.rating = rating;
    }

    if (review !== undefined) {
      updateData.review = review;
    }

    if (Object.keys(updateData).length == 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a rating or a review text to update",
      });
    }

    updateData.isEdited = true;

    const updatedReview = await Review.findByIdAndUpdate(
      { userId, eventId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event Id format",
      });
    }

    const deletedReview = await Review.findOneAndDelete({ userId, eventId });

    if (!deleteReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission to delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      deletedReviewId: deletedReview._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventRatingSummary = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event Id format",
      });
    }

    const stats = await Review.aggregate([
      {
        $match: {
          eventId: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $group: {
          _id: "$eventId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingBreakdown: {
            $push: "$rating",
          },
        },
      },
    ]);

    if (stats.length == 0) {
      return res.status(200).json({
        success: true,
        averageRating: 0,
        totalReviews: 0,
        breakdown: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      });
    }

    const { averageRating, totalReviews, ratingBreakdown } = stats[0];
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingBreakdown.forEach((r) => breakdown[r]++);

    return res.status(200).json({
      success: true,
      data: {
        eventId,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
        breakdown,
      },
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
  getEventReviews,
  getMyReview,
  updateReview,
  deleteReview,
  getEventRatingSummary,
};
