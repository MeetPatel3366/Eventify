const express = require("express");
const router = express.Router();
const {
  getEventsProgress,
  getEventProgress,
  addEventProgress,
  updateEventProgress,
  deleteEventProgress,
} = require("../controllers/EventProgressController");

router.route("/").get(getEventsProgress).post(addEventProgress);
router
  .route("/:id")
  .get(getEventProgress)
  .put(updateEventProgress)
  .delete(deleteEventProgress);

module.exports = router;
