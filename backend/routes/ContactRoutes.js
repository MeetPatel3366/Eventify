const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { contactForm } = require("../controllers/ContactMessageController");
const router = express.Router();

router.post("/", isLoggedIn, contactForm);

module.exports = router;
