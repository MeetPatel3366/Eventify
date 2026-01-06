const Booking = require("../models/BookingModel");
const Event = require("../models/EventModel");

const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.id;
    console.log(eventId, quantity, userId);

    const event = await Event.findOneAndUpdate(
      { _id: eventId, status: "approved", availableSeats: { $gte: quantity } },
      { $inc: { availableSeats: -quantity } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.availableSeats < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    const booking = await Booking.create({
      userId,
      eventId,
      quantity,
      totalAmount: event.price * quantity,
    });

    return res.status(201).json({
      success: true,
      message: "Event booked successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const myBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId })
      .populate("eventId")
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((booking) => ({
      ...booking.toObject(),
      eventId: {
        ...booking.eventId.toObject(),
        image: booking.eventId.image
          ? `${req.protocol}://${req.get("host")}/uploads/${
              booking.eventId.image
            }`
          : null,
      },
    }));

    if (!bookings) {
      return res.status(404).json({
        success: false,
        message: "No bookings found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      bookings: formattedBookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyEventBookings = async (req, res) => {
  try {
    const { eventID } = req.params;
    const organizerId = req.user.id;

    const event = await Event.findOne({
      _id: eventID,
      organizerId,
      status: "approved",
    });

    if (!event) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to event bookings",
      });
    }

    const bookings = await Booking.find({
      eventId: eventID,
      status: "confirmed",
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      event: {
        name: event.name,
        datetime: event.datetime,
        location: event.location,
      },
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  myBookings,
  getMyEventBookings,
};
