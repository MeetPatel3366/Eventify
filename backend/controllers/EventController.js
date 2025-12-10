const Event = require("../models/EventModel.js");

const addEvent = async (req, res) => {
  try {
    const { name, category, date, location, description, price } = req.body;

    const newEvent = await Event.create({
      name,
      category,
      date,
      location,
      description,
      price,
      image: req.file ? req.file.filename : null,
    });

    return res.status(201).json({
      success: true,
      message: "event created successfully",
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
    const events = await Event.find({});

    const updatedEvents = events.map((event) => ({
      ...event._doc,
      image: `${req.protocol}://${req.get("host")}/uploads/${event.image}`,
    }));
    return res.status(200).json({
      success: true,
      message: "events fetched successfully",
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
      event.image = req.file.filename;
    }

    const updatedEvent = await event.save();

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
    return res.status(200).json({
      success: true,
      message: `event deleted with id: ${eventID}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getEvent, getEvents, addEvent, updateEvent, deleteEvent };
