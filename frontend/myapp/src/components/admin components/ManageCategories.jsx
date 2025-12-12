import React, { useState } from "react";

const ManageCategories = () => {
  const [categories, setCategories] = useState([
    "Technology",
    "Marketing",
    "Entertainment"
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState("");

  // Handle category input change
  const handleInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  // Add a new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    if (categories.includes(newCategory.trim())) {
      alert("Category already exists!");
      return;
    }

    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
    alert("Category added successfully!");
  };

  // Handle edit button click
  const handleEditClick = (category) => {
    setEditCategory(category);
    setUpdatedCategory(category);
  };

  // Handle update category
  const handleUpdateCategory = () => {
    if (!updatedCategory.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    if (categories.includes(updatedCategory.trim())) {
      alert("Category already exists!");
      return;
    }

    const updatedCategories = categories.map((cat) =>
      cat === editCategory ? updatedCategory.trim() : cat
    );

    setCategories(updatedCategories);
    setEditCategory(null);
    alert("Category updated successfully!");
  };

  // Delete a category
  const handleDeleteCategory = (category) => {
    const updatedCategories = categories.filter((cat) => cat !== category);
    setCategories(updatedCategories);
    alert("Category deleted successfully!");
  };

  return (
    <div className="manage-categories-page">
      <h1>Manage Event Categories</h1>

      {/* Add New Category Section */}
      <div className="add-category">
        <h2>Add New Category</h2>
        <input
          type="text"
          value={newCategory}
          placeholder="Category Name"
          onChange={handleInputChange}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      {/* Category List Section */}
      <div className="category-list">
        <h2>Event Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index} className="category-item">
              {editCategory === category ? (
                <input
                  type="text"
                  value={updatedCategory}
                  onChange={(e) => setUpdatedCategory(e.target.value)}
                />
              ) : (
                <span>{category}</span>
              )}
              {editCategory === category ? (
                <button className="update-btn" onClick={handleUpdateCategory}>
                  Update
                </button>
              ) : (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageCategories;
