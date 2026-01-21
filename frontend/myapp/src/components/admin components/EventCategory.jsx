import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  editCategory,
  deleteCategory,
} from "../../store/categorySlice";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const EventCategory = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await dispatch(createCategory(newCategory.trim())).unwrap();
      setNewCategory("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return;
    try {
      await dispatch(
        editCategory({ id: editId, name: editName.trim() }),
      ).unwrap();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 text-slate-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Manage Event Categories
        </h1>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-[#f0f4f9] text-slate-900 rounded-lg outline-none w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <hr className="border-slate-700 mb-10" />

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">
              New Category
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                type="text"
                placeholder="Enter name..."
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 outline-none focus:border-blue-400 transition-all"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !newCategory.trim()}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                <FaPlus size={12} /> Create
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {filteredCategories.length === 0 ? (
              <div className="p-10 text-center text-slate-400 italic">
                No categories found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    {editId === cat._id ? (
                      <div className="flex flex-1 gap-2">
                        <input
                          className="flex-1 border border-blue-300 rounded-lg px-3 py-1 text-slate-900 outline-none"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                        <button
                          onClick={handleUpdate}
                          className="text-emerald-500 p-2"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="text-slate-400 p-2"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-slate-700 text-lg font-normal">
                          {cat.name}
                        </span>
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setEditId(cat._id);
                              setEditName(cat.name);
                            }}
                            className="text-slate-500 hover:text-blue-500 transition-all"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="text-slate-500 hover:text-rose-400 transition-all"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-400 ml-1">
            {filteredCategories.length} categories
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCategory;
