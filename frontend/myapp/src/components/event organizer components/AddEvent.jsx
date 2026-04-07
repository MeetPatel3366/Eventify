import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaAlignLeft,
  FaPlusCircle,
  FaUsers,
  FaTrash,
  FaPalette,
} from "react-icons/fa";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdPinDrop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../../store/eventSlice";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../store/categorySlice";
import toast from "react-hot-toast";

export default function AddEvent() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    datetime: "",
    location: "",
    description: "",
    price: "",
    totalSeats: "",
    pincode: "",
    image: null,
  });

  const [themes, setThemes] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!textRegex.test(value))
          return "Event name should contain only letters";
        break;
      case "category":
        if (!value) return "Category is required";
        break;
      case "datetime":
        if (!value) return "Event date & time is required";
        if (new Date(value) <= new Date())
          return "Event date & time must be in the future";
        break;
      case "location":
        if (!value.trim()) return "Location is required";
        if (!textRegex.test(value))
          return "Location should contain only letters";
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
      case "pincode":
        if (value && !/^\d{6}$/.test(value))
          return "Pincode must be exactly 6 digits";
        break;
      default:
        return "";
    }
    return "";
  };

  const formatLocation = (value) =>
    value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let val = files ? files[0] : value;

    if (name === "location" && typeof val === "string") {
      val = formatLocation(val);
    }

    if (name === "pincode") {
      val = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    setErrors((prev) => ({ ...prev, [name]: validateField(name, val) }));
  };

  // Theme handlers
  const addTheme = () => {
    setThemes((prev) => [...prev, { name: "", images: [], previews: [] }]);
  };

  const removeTheme = (index) => {
    setThemes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleThemeNameChange = (index, value) => {
    setThemes((prev) =>
      prev.map((t, i) => (i === index ? { ...t, name: value } : t))
    );
  };

  const handleThemeImagesChange = (index, files) => {
    const fileArray = Array.from(files);
    const previews = fileArray.map((f) => URL.createObjectURL(f));
    setThemes((prev) =>
      prev.map((t, i) =>
        i === index
          ? {
              ...t,
              images: [...t.images, ...fileArray],
              previews: [...t.previews, ...previews],
            }
          : t
      )
    );
  };

  const removeThemeImage = (themeIndex, imgIndex) => {
    setThemes((prev) =>
      prev.map((t, i) =>
        i === themeIndex
          ? {
              ...t,
              images: t.images.filter((_, j) => j !== imgIndex),
              previews: t.previews.filter((_, j) => j !== imgIndex),
            }
          : t
      )
    );
  };

  useEffect(() => {
    const hasError = [
      "name",
      "category",
      "datetime",
      "location",
      "description",
      "price",
      "totalSeats",
    ].some((field) => validateField(field, formData[field]));

    // Check themes have names if they exist
    const themesValid = themes.every((t) => t.name.trim() !== "");

    setIsFormValid(!hasError && (themes.length === 0 || themesValid));
  }, [formData, themes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && key !== "image") data.append(key, value);
    });

    // Append main image
    if (formData.image) {
      data.append("image", formData.image);
    }

    // Append themes metadata and images
    if (themes.length > 0) {
      const themesMetadata = themes.map((t) => ({
        name: t.name,
        imageCount: t.images.length,
      }));
      data.append("themes", JSON.stringify(themesMetadata));

      // Append all theme images in order
      themes.forEach((theme) => {
        theme.images.forEach((img) => {
          data.append("themeImages", img);
        });
      });
    }

    try {
      await dispatch(addEvent(data)).unwrap();

      toast.success("Event submitted successfully! Awaiting admin approval");

      setTimeout(() => {
        navigate("/organizer/events");
      }, 1500);
    } catch (error) {
      toast.error(error?.message || "Failed to add event");
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
        Fill in the details below. Your event will be submitted for admin
        approval.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Event Name</label>
          <div className="bg-white/20 border border-white/20 rounded-xl p-3">
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          {showError("name") && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <div className="bg-white/20 border border-white/20 rounded-xl p-3">
            <select
              name="category"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
            >
              <option value="" className="text-black">
                Select Category
              </option>
              {loading ? (
                <option disabled>Loading...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="text-black">
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>
          {showError("category") && (
            <p className="text-red-400 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Event Date & Time</label>
          <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
            <FaCalendarAlt className="text-gray-300" />
            <input
              type="datetime-local"
              name="datetime"
              min={new Date().toISOString().slice(0, 16)}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          {showError("datetime") && (
            <p className="text-red-400 text-sm mt-1">{errors.datetime}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Location</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaMapMarkerAlt className="text-gray-300" />
              <input
                type="text"
                name="location"
                onChange={handleChange}
                onBlur={(e) => {
                  const val = e.target.value;
                  if (val) {
                    setFormData((prev) => ({
                      ...prev,
                      location: formatLocation(val),
                    }));
                  }
                }}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {showError("location") && (
              <p className="text-red-400 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Pincode</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <MdPinDrop className="text-gray-300" />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                placeholder="e.g. 380001"
                onChange={handleChange}
                maxLength={6}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {showError("pincode") && (
              <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <div className="flex gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
            <FaAlignLeft className="text-gray-300 mt-1" />
            <textarea
              name="description"
              rows="4"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          {showError("description") && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2">Price</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <TbCurrencyRupee />
              <input
                type="number"
                name="price"
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {showError("price") && (
              <p className="text-red-400 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Total Capacity</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaUsers />
              <input
                type="number"
                name="totalSeats"
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {showError("totalSeats") && (
              <p className="text-red-400 text-sm mt-1">{errors.totalSeats}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Event Image</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaImage />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* --- Event Themes Section --- */}
        <div className="border border-white/20 rounded-2xl p-6 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaPalette className="text-purple-400" />
              Event Themes
            </h2>
            <button
              type="button"
              onClick={addTheme}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-semibold transition"
            >
              <FaPlusCircle /> Add Theme
            </button>
          </div>

          {themes.length === 0 && (
            <p className="text-gray-500 text-sm italic">
              No themes added yet. Add themes like "Birthday Royal", "Elegant
              White", etc.
            </p>
          )}

          {themes.map((theme, themeIdx) => (
            <div
              key={themeIdx}
              className="bg-white/10 rounded-xl p-4 mb-4 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Theme Name (e.g. Royal Blue Birthday)"
                  value={theme.name}
                  onChange={(e) =>
                    handleThemeNameChange(themeIdx, e.target.value)
                  }
                  className="flex-1 bg-white/20 border border-white/20 rounded-xl p-3 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeTheme(themeIdx)}
                  className="p-3 bg-red-600 hover:bg-red-700 rounded-xl transition"
                >
                  <FaTrash />
                </button>
              </div>

              {!theme.name.trim() && (
                <p className="text-red-400 text-xs mb-2">
                  Theme name is required
                </p>
              )}

              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 rounded-xl cursor-pointer text-sm font-medium transition">
                  <FaImage /> Add Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      handleThemeImagesChange(themeIdx, e.target.files)
                    }
                    className="hidden"
                  />
                </label>
                <span className="text-gray-400 text-xs">
                  {theme.images.length} photo(s) selected
                </span>
              </div>

              {theme.previews.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {theme.previews.map((preview, imgIdx) => (
                    <div key={imgIdx} className="relative group">
                      <img
                        src={preview}
                        alt={`Theme ${themeIdx + 1} Photo ${imgIdx + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeThemeImage(themeIdx, imgIdx)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl transition font-semibold shadow-xl flex items-center justify-center gap-2 ${
            isFormValid
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                width="20"
                height="20"
                fill="hsl(228, 97%, 42%)"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="0.75s"
                    values="0 12 12;360 12 12"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <FaPlusCircle /> Submit Event for Approval
            </>
          )}
        </button>
      </form>
    </section>
  );
}
