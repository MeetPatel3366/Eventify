const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");
const {
  addCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/CategoryController");

router.get("/", isLoggedIn, getAllCategories);

router.post("/", isLoggedIn, isAdmin, addCategory);

router.put("/:categoryId", isLoggedIn, isAdmin, editCategory);

router.delete("/:categoryId", isLoggedIn, isAdmin, deleteCategory);

module.exports = router;
