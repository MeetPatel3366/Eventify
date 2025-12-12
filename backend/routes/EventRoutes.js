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
const { isLoggedIn } = require("../middleware/authMiddleware");

router.post("/", isLoggedIn, upload.single("image"), addEvent);
router.get("/", isLoggedIn, getEvents);
router.get("/:id", isLoggedIn, getEvent);
router.put("/:id", isLoggedIn, upload.single("image"), updateEvent);
router.delete("/:id", isLoggedIn, deleteEvent);

module.exports = router;
