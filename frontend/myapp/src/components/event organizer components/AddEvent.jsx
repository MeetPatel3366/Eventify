import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaAlignLeft,
  FaPlusCircle,
  FaUsers,
} from "react-icons/fa";
import { TbCurrencyRupee } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../../store/eventSlice";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../store/categorySlice";

export default function AddEvent() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    datetime: "",
    location: "",
    description: "",
    price: "",
    totalSeats: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const validateField = (name, value) => {
    const textRegex = /^[A-Za-z\s]+$/;
    switch (name) {
      case "name":
        if (!value.trim()) return "Event name is required";
        if (!textRegex.test(value)) return "Event name should contain only letters";
        break;
      case "category":
        if (!value) return "Category is required";
        break;
      case "datetime":
        if (!value) return "Event date & time is required";
        if (new Date(value) <= new Date()) return "Event date & time must be in the future";
        break;
      case "location":
        if (!value.trim()) return "Location is required";
        if (!textRegex.test(value)) return "Location should contain only letters";
        break;
      case "description":
        if (!value.trim()) return "Description is required";
        break;
      case "price":
        if (!value) return "Price is required";
        if (Number(value) <= 0) return "Price must be greater than 0";
        break;
      case "totalSeats":
        if (!value) return "Total capacity is required";
        if (Number(value) <= 0) return "Total capacity must be greater than 0";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const val = files ? files[0] : value;

    setFormData((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    setErrors((prev) => ({ ...prev, [name]: validateField(name, val) }));
  };

  useEffect(() => {
    const hasError = ["name", "category", "datetime", "location", "description", "price", "totalSeats"].some(
      (field) => validateField(field, formData[field])
    );
    setIsFormValid(!hasError);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      await dispatch(addEvent(data)).unwrap();
      navigate("/organizer/events");
    } catch (error) {
      console.log("add event failed:", error.message);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <section className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 mt-4 mb-4">
      <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3">
        <FaPlusCircle className="text-indigo-400" />
        Create New Event
      </h1>

      <p className="text-gray-300 mb-10">
        Fill in the details below. Your event will be submitted for admin approval.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Event Name</label>
          <div className="bg-white/20 border border-white/20 rounded-xl p-3">
            <input type="text" name="name" onChange={handleChange} className="w-full bg-transparent focus:outline-none" />
          </div>
          {showError("name") && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <div className="bg-white/20 border border-white/20 rounded-xl p-3">
            <select name="category" onChange={handleChange} className="w-full bg-transparent focus:outline-none text-white">
              <option value="" className="text-black">Select Category</option>
              {loading ? (
                <option disabled>Loading...</option>
              ) : (
                categories.map((cat) => <option key={cat._id} value={cat._id} className="text-black">{cat.name}</option>)
              )}
            </select>
          </div>
          {showError("category") && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block mb-2">Event Date & Time</label>
          <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
            <FaCalendarAlt className="text-gray-300" />
            <input type="datetime-local" name="datetime" min={new Date().toISOString().slice(0, 16)} onChange={handleChange} className="w-full bg-transparent focus:outline-none" />
          </div>
          {showError("datetime") && <p className="text-red-400 text-sm mt-1">{errors.datetime}</p>}
        </div>

        <div>
          <label className="block mb-2">Location</label>
          <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
            <FaMapMarkerAlt className="text-gray-300" />
            <input type="text" name="location" onChange={handleChange} className="w-full bg-transparent focus:outline-none" />
          </div>
          {showError("location") && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <div className="flex gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
            <FaAlignLeft className="text-gray-300 mt-1" />
            <textarea name="description" rows="4" onChange={handleChange} className="w-full bg-transparent focus:outline-none" />
          </div>
          {showError("description") && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2">Price</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <TbCurrencyRupee />
              <input type="number" name="price" onChange={handleChange} className="w-full bg-transparent focus:outline-none" />
            </div>
            {showError("price") && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block mb-2">Total Capacity</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaUsers />
              <input type="number" name="totalSeats" onChange={handleChange} className="w-full bg-transparent focus:outline-none" />
            </div>
            {showError("totalSeats") && <p className="text-red-400 text-sm mt-1">{errors.totalSeats}</p>}
          </div>

          <div>
            <label className="block mb-2">Event Image</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaImage />
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full text-sm" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl transition font-semibold shadow-xl flex items-center justify-center gap-2 ${
            isFormValid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          <FaPlusCircle /> Submit Event for Approval
        </button>
      </form>
    </section>
  );
}