import Category from "../models/CategoryModel.js";
import Event from "../models/EventModel.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
      count: categories.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.toLowerCase().trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name: name.toLowerCase().trim() });

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const duplicate = await Category.findOne({
      name: name.toLowerCase().trim(),
      _id: { $ne: categoryId },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name: name.toLowerCase().trim() },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log("delete categoryId:", categoryId);

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const isUsed = await Event.findOne({ category: categoryId });

    if (isUsed) {
      return res.status(400).json({
        success: false,
        message:
          "Category is associated with existing events and cannot be deleted",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllCategories, addCategory, editCategory, deleteCategory };
