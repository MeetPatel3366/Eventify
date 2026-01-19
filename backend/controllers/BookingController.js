const Booking = require("../models/BookingModel");
const Event = require("../models/EventModel");
const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.id;
    console.log(eventId, quantity, userId);

    const event = await Event.findOne({
      _id: eventId,
      status: "approved",
      availableSeats: { $gte: quantity },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or not enough seats",
      });
    }

    const booking = await Booking.create({
      userId,
      eventId,
      quantity,
      totalAmount: event.price * quantity,
      paymentStatus: "pending",
      status: "pending",
    });

    const options = {
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: `receipt_order_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    booking.razorpayOrderId = order.id;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      order,
      bookingId: booking._id,
      key: process.env.RAZORPAY_TEST_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyBookingPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_TEST_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      booking.paymentStatus = "failed";
      await booking.save();
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentStatus = "paid";
    booking.status = "confirmed";

    await Event.updateOne(
      { _id: booking.eventId },
      { $inc: { availableSeats: -booking.quantity } },
    );

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log("start cancellation for bookingId :", bookingId);

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel booking",
      });
    }

    if (booking.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Only paid bookings can be cancelled",
      });
    }

    const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
      amount: booking.totalAmount * 100,
      speed: "normal",
    });

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    booking.isCancelled = true;
    await booking.save();

    const event = await Event.findById(booking.eventId);
    event.availableSeats += booking.quantity;
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled & refunded successfully",
      booking,
      refund,
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

    const [bookings, userReviews] = await Promise.all([
      Booking.find({ userId }).populate("eventId").sort({ createdAt: -1 }),
      Review.find({ userId }).lean(),
    ]);

    const formattedBookings = bookings.map((booking) => {
      const bookingObj = booking.toObject();
      const event = bookingObj.eventId;

      const existingReview = userReviews.find(
        (rev) => rev.eventId.toString() === event._id.toString(),
      );

      return {
        ...bookingObj,
        hasReviewed: !!existingReview,
        userReview: existingReview || null,

        eventId: {
          ...event,
          image: event.image
            ? `${req.protocol}://${req.get("host")}/uploads/${event.image}`
            : null,
          isCompleted: new Date(event.datetime) < new Date(),
        },
      };
    });

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
    await booking.save();

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
      "username email",
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
            organizerEventIds.some((oid) => oid.equals(id)),
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

const getBookingAnalytics = async (req, res) => {
  try {
    const dailyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    const dailyRevenue = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topEvents = await Booking.aggregate([
      {
        $group: {
          _id: "$eventId",
          totalBookings: { $sum: "$quantity" },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "details",
        },
      },
      { $unwind: "$details" },
      {
        $project: {
          _id: 1,
          totalBookings: 1,
          eventName: "$details.name",
          category: "$details.category",
          price: "$details.price",
        },
      },
    ]);

    const topOrganizers = await Booking.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $group: {
          _id: "$event.organizerId",
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "organizer",
        },
      },
      { $unwind: "$organizer" },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          revenue: 1,
          organizerName: "$organizer.username",
          email: "$organizer.email",
        },
      },
    ]);

    console.log(dailyBookings, dailyRevenue, topEvents, topOrganizers);
    return res.status(200).json({
      success: true,
      dailyBookings,
      dailyRevenue,
      topEvents,
      topOrganizers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  verifyBookingPayment,
  cancelBooking,
  myBookings,
  getMyEventBookings,
  markBookingCheckedIn,
  exportBookingsCSV,
  getAllBookings,
  getBookingAnalytics,
};
