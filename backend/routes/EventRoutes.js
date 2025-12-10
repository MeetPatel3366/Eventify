const express = require("express");
const router = express.Router();
const {
  addEvents,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/EventController");

router.route("/").get(getEvents).post(addEvents);
router.route("/:id").get(getEvent).put(updateEvent).delete(deleteEvent);

module.exports = router;
