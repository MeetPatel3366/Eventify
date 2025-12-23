const User = require("../models/UserModel");
const Event = require("../models/EventModel");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });

    const approvedOrganizers = await User.countDocuments({
      role: "eventorganizer",
      organizerStatus: "approved",
    });

    const pendingOrganizers = await User.countDocuments({
      role: "eventorganizer",
      organizerStatus: "pending",
    });

    const rejectedOrganizers = await User.countDocuments({
      role: "eventorganizer",
      organizerStatus: "rejected",
    });

    const totalEvents = await Event.countDocuments();

    const approvedEvents = await Event.countDocuments({ status: "approved" });

    const pendingEvents = await Event.countDocuments({ status: "pending" });

    const rejectedEvents = await Event.countDocuments({ status: "rejected" });

    const now = new Date();

    const upcomingEvents = await Event.countDocuments({
      status: "approved",
      date: { $gte: now },
    });

    const pastEvents = await Event.countDocuments({
      status: "approved",
      date: { $lt: now },
    });

    return res.status(200).json({
      success: true,
      message: "stats fetched successfully",
      stats: {
        totalUsers,
        approvedOrganizers,
        pendingOrganizers,
        rejectedOrganizers,
        totalEvents,
        approvedEvents,
        pendingEvents,
        rejectedEvents,
        upcomingEvents,
        pastEvents,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({
      role: "eventorganizer",
      organizerStatus: "pending",
    }).select("username email createdAt");

    return res.status(200).json({
      success: true,
      organizers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getApprovedOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({
      role: "eventorganizer",
      organizerStatus: "approved",
    }).select("username email createdAt");

    return res.status(200).json({
      success: true,
      organizers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRejectedOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({
      role: "eventorganizer",
      organizerStatus: "rejected",
    }).select("username email createdAt");

    return res.status(200).json({
      success: true,
      organizers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    const organizer = await User.findById(id);

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "organizer not found",
      });
    }

    if (organizer.organizerStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Organizer already processed",
      });
    }

    organizer.organizerStatus = "approved";
    await organizer.save();

    return res.status(200).json({
      success: true,
      message: "organizer approved successfully",
      organizer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    const organizer = await User.findById(id);

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "organizer not found",
      });
    }

    organizer.organizerStatus = "rejected";
    await organizer.save();

    return res.status(200).json({
      success: true,
      message: "organizer rejected permanently",
      organizer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getPendingOrganizers,
  getApprovedOrganizers,
  getRejectedOrganizers,
  approveOrganizer,
  rejectOrganizer,
};
