const events = require("../models/EventModel");

const addEvents = async (req, res) => {
  try {
    const event = await events.create(req.body);
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const event = await events.find({});
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;
    const event = await events.findOneAndUpdate({ _id: eventID }, req.body);
    if (!event) {
      return res
        .status(404)
        .json({ msg: `Data not found with id: ${eventID}` });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;
    const event = await events.findOne({ _id: eventID });
    if (!event) {
      return res
        .status(404)
        .json({ msg: `Data not found with id: ${eventID}` });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;
    const event = events.findOneAndDelete({ _id: eventID });
    if (!event) {
      return res
        .status(404)
        .json({ msg: `Data not found with id: ${eventID}` });
    }
    return res.status(200).json({ msg: `Data deleted with id: ${eventID}` });
  } catch (eror) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = { getEvent, getEvents, addEvents, updateEvent, deleteEvent };
