const events = require("../models/EventProgressModel");

const addEventProgress = async (req, res) => {
  try {
    const event = await events.create(req.body);
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getEventsProgress = async (req, res) => {
  try {
    const event = await events.find({});
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getEventProgress = async (req, res) => {
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

const updateEventProgress = async (req, res) => {
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

const deleteEventProgress = async (req, res) => {
  try {
    const eventID = await req.params.id;
    const event = await events.findOneAndDelete({ _id: eventID });
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

module.exports = {
  getEventsProgress,
  addEventProgress,
  getEventProgress,
  updateEventProgress,
  deleteEventProgress,
};
