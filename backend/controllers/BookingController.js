const Booking = require("../models/BookingModel");
const Event = require("../models/EventModel");
const User = require("../models/UserModel");

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
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      event: {
        name: event.name,
        datetime: event.datetime,
        location: event.location,
        price: event.price,
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

const markBookingCheckedIn = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const organizerId = req.user.id;

    const booking = await Booking.findById(bookingId).populate("eventId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.eventId.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to mark booking",
      });
    }

    booking.checkedIn = true;
    booking.save();

    return res.status(200).json({
      success: true,
      message: "booking checked in successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportBookingsCSV = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.id;

    console.log(eventId);
    console.log(organizerId);
    const event = await Event.findOne({
      _id: eventId,
      organizerId: organizerId,
    });

    if (!event) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized export booking csv for this event",
      });
    }

    const bookings = await Booking.find({ eventId: event._id }).populate(
      "userId",
      "username email"
    );

    const csvRows = [
      [
        "UserName",
        "Email",
        "Seats",
        "Amount",
        "Status",
        "Checked In",
        "Booked On",
      ],
      ...bookings.map((b) => [
        b.userId.username,
        b.userId.email,
        b.quantity,
        b.totalAmount,
        b.status,
        b.checkedIn ? "Yes" : "No",
        new Date(b.createdAt).toLocaleString(),
      ]),
    ];

    const csv = csvRows.map((r) => r.join(",")).join("\n");

    res.header("Content-Type", "text/csv");
    res.attachment(`event-${eventId}-bookings.csv`);
    return res.send(csv);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { eventname, organizername, status, startDate, endDate } = req.query;
    console.log("req query : ", req.query);

    let filter = {};
    let eventIds = null;

    if (eventname) {
      const events = await Event.find({
        name: {
          $regex: eventname,
          $options: "i",
        },
      }).select("_id");

      eventIds = events.map((e) => e._id);
    }

    if (organizername) {
      const organizers = await User.find({
        username: {
          $regex: organizername,
          $options: "i",
        },
        role: "eventorganizer",
      }).select("_id");

      const events = await Event.find({
        organizerId: { $in: organizers.map((o) => o._id) },
      });

      const organizerEventIds = events.map((e) => e._id);

      eventIds = eventIds
        ? eventIds.filter((id) =>
            organizerEventIds.some((oid) => oid.equals(id))
          )
        : organizerEventIds;
    }

    if (eventIds) {
      filter.eventId = { $in: eventIds };
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "username email")
      .populate({
        path: "eventId",
        select: "name price location datetime",
        populate: {
          path: "organizerId",
          select: "username email",
        },
      })
      .sort({ createdAt: -1 });

    console.log("bookings : ", bookings);
    return res.status(200).json({
      success: true,
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
  markBookingCheckedIn,
  exportBookingsCSV,
  getAllBookings,
};
