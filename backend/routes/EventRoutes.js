const express = require("express");
const router = express.Router();
const {
  addEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
} = require("../controllers/EventController");
const upload = require("../utils/multer");
const {
  isLoggedIn,
  isEventOrganizer,
  isAdmin,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  upload.single("image"),
  isLoggedIn,
  isEventOrganizer,
  addEvent
);
router.get("/", isLoggedIn, getEvents);
router.get("/:id", isLoggedIn, getEvent);
router.put("/:id", isLoggedIn, upload.single("image"), updateEvent);
router.delete("/:id", isLoggedIn, deleteEvent);
router.patch("/approve/:id", isLoggedIn, isAdmin, approveEvent);
router.patch("/reject/:id", isLoggedIn, isAdmin, rejectEvent);
module.exports = router;
