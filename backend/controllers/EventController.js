const Event = require("../models/EventModel.js");
const { deleteImage } = require("../utils/deleteFile.js");

const addEvent = async (req, res) => {
  try {
    const { name, category, datetime, location, description, price } = req.body;

    const newEvent = await Event.create({
      name,
      category,
      datetime: new Date(datetime),
      location,
      description,
      price,
      organizerId: req.user.id,
      status: "pending",
      image: req.file ? req.file.filename : null,
    });

    console.log("newEvent: ", newEvent);
    console.log("newEvent._doc", newEvent._doc);
    console.log(
      "image: ",
      req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null
    );

    return res.status(201).json({
      success: true,
      message: "event submitted for approval",
      event: {
        ...newEvent._doc,
        image: req.file
          ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });

    if (events.length == 0) {
      return res.status(200).json({
        success: true,
        message: "no approved events found at this time.",
        events: [],
      });
    }

    const updatedEvents = events.map((event) => ({
      ...event._doc,
      image: `${req.protocol}://${req.get("host")}/uploads/${event.image}`,
    }));

    console.log("events: ", updatedEvents);

    return res.status(200).json({
      success: true,
      message: "approved events fetched successfully",
      events: updatedEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;

    const event = await Event.findById(eventID);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `event not found with id: ${eventID}`,
      });
    }

    event.name = req.body.name || event.name;
    event.category = req.body.category || event.category;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;
    event.description = req.body.description || event.description;
    event.price = req.body.price || event.price;

    if (req.file) {
      deleteImage(event.image);
      event.image = req.file.filename;
    }

    const updatedEvent = await event.save();

    console.log("updated Event : ", updatedEvent);

    return res.status(200).json({
      success: true,
      message: "event updated successfully",
      updatedEvent: {
        ...updatedEvent._doc,
        image: updatedEvent.image
          ? `${req.protocol}://${req.get("host")}/uploads/${updatedEvent.image}`
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;
    const event = await Event.findById(eventID);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `event not found with id: ${eventID}`,
      });
    }

    console.log("event : ", event);

    return res.status(200).json({
      success: true,
      message: `event ${eventID} fetched successfully`,
      event: {
        ...event._doc,
        image: event.image
          ? `${req.protocol}://${req.get("host")}/uploads/${event.image}`
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;
    const event = await Event.findByIdAndDelete(eventID);
    if (!event) {
      return res.status(404).json({
        success: true,
        message: `event not found with id: ${eventID}`,
      });
    }

    deleteImage(event.image);

    console.log("delete event : ", event);

    return res.status(200).json({
      success: true,
      message: `event deleted with id: ${eventID} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "event not found",
      });
    }

    event.status = "approved";
    event.feedback = "";
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event approved successfully",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectEvent = async (req, res) => {
  try {
    const { feedback } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "event not found",
      });
    }

    event.status = "rejected";
    event.feedback = feedback || "no feedback provided";

    await event.save();

    return res.status(200).json({
      success: true,
      message: "event rejected",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id });

    if (events.length == 0) {
      return res.status(404).json({
        success: false,
        message: "events not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "events fetched successfully",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" }).populate(
      "organizerId",
      "username email"
    );

    if (events.length == 0) {
      return res.status(404).json({
        success: false,
        message: "no pending events found",
      });
    }

    const updatedEvents = events.map((event) => ({
      ...event._doc,
      image: `${req.protocol}://${req.get("host")}/uploads/${event.image}`,
    }));

    return res.status(200).json({
      success: true,
      message: "pending events fetched successfully",
      events: updatedEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getEvent,
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  getMyEvents,
  getPendingEvents,
};
