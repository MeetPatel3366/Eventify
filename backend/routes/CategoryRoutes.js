import express from "express";
const router = express.Router();
import { isLoggedIn, isAdmin } from "../middleware/authMiddleware.js";
import {
  addCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/CategoryController.js";
import { apiLimiter } from "../middleware/rateLimitMiddleware.js";

router.use(apiLimiter)

router.get("/", isLoggedIn, getAllCategories);

router.post("/", isLoggedIn, isAdmin, addCategory);

router.put("/:categoryId", isLoggedIn, isAdmin, editCategory);

router.delete("/:categoryId", isLoggedIn, isAdmin, deleteCategory);

export default router;
