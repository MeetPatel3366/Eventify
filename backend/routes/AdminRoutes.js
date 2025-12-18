const express = require("express");
const { getPendingOrganizers } = require("../controllers/AdminController");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/pending-organizers", isLoggedIn, isAdmin, getPendingOrganizers);

module.exports = router;
