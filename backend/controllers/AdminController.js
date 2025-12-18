const User = require("../models/UserModel");

const getPendingOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({
      role: "eventorganizer",
      organizerStatus: "pending",
    }).select("username email createdAt");

    res.status(200).json({
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getPendingOrganizers, approveOrganizer };
