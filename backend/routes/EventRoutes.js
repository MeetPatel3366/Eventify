const express = require("express");
const router = express.Router();
const {
  addEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/EventController");
const upload = require("../utils/multer");

router.post("/", upload.single("image"), addEvent);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.put("/:id", upload.single("image"), updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
