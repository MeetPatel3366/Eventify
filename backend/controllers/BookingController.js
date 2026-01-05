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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createBooking,
};
