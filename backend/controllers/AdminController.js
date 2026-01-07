const User = require("../models/UserModel");
const Event = require("../models/EventModel");
const ContactMessage = require("../models/ContactMessageModel");

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
    })
      .select("username email createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: organizers.length,
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

const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    console.log(messages);
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.status == "new") {
      message.status = "read";
      await message.save();
    }
    return res.status(200).json({
      success: true,
      message: "contact message fetched successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const replyContactMessage = async (req, res) => {
  try {
    const { reply } = req.body;

    const message = await ContactMessage.findById(req.params.id);

    message.adminReply = reply;
    message.status = "replied";

    await message.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILHOST,
      port: parseInt(process.env.MAILPORT, 10),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: message.email,
      subject: "Reply from Eventify Support",
      html: `<p>${reply}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "replied to contact message successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("username email createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
      deleteUser,
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
  getAllContactMessages,
  getContactMessage,
  replyContactMessage,
  getAllUsers,
  deleteUser,
};
