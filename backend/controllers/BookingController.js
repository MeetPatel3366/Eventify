const Booking = require("../models/BookingModel");
const Event = require("../models/EventModel");

const createBooking = async (req, res) => {
  try {
    const { eventId, quntity } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.availableSeats < quntity) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    const booking = await Booking.create({
      userId,
      eventId,
      quntity,
      totalAmount: event.price * quntity,
    });

    event.availableSeats = event.availableSeats - quntity;
    await event.save();

    return res.status(201).json({
      success: true,
      message: "Event booked successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createBooking,
};
