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
const { isLoggedIn, isEventOrganizer } = require("../middleware/authMiddleware");

router.post("/", upload.single("image"),isLoggedIn,isEventOrganizer,addEvent);
router.get("/", isLoggedIn, getEvents);
router.get("/:id", isLoggedIn, getEvent);
router.put("/:id", isLoggedIn, upload.single("image"), updateEvent);
router.delete("/:id", isLoggedIn, deleteEvent);

module.exports = router;
