import { useEffect, useState, useCallback } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaAlignLeft,
  FaEdit,
  FaUsers,
  FaTrash,
  FaPlusCircle,
  FaPalette,
} from "react-icons/fa";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdPinDrop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, updateEvent } from "../../store/eventSlice";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories } from "../../store/categorySlice";
import toast from "react-hot-toast";

const EditEvent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { event } = useSelector((state) => state.event);
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.category,
  );

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  const toLocalDateTime = (utcDate) => {
    const date = new Date(utcDate);
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        category: event.category?._id || "",
        datetime: toLocalDateTime(event.datetime),
        location: event.location || "",
        description: event.description || "",
        price: event.price || "",
        totalSeats: event.totalSeats || "",
        pincode: event.pincode || "",
        image: null,
      });

      // Load existing themes
      if (event.themes && event.themes.length > 0) {
        setThemes(
          event.themes.map((t) => ({
            name: t.name || "",
            images: [], // new files to upload
            previews: [], // preview URLs for new files
            existingImages: t.images || [], // already uploaded images
          }))
        );
      } else {
        setThemes([]);
      }
    }
  }, [event]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const textRegex = /^[A-Za-z\s]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    } else if (!textRegex.test(formData.name)) {
      newErrors.name = "Event name should contain only letters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (!textRegex.test(formData.location)) {
      newErrors.location = "Location should contain only letters";
    }

    if (!formData.datetime) {
      newErrors.datetime = "Event date & time is required";
    } else if (new Date(formData.datetime) <= new Date()) {
      newErrors.datetime = "Event date & time must be in the future";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.totalSeats) {
      newErrors.totalSeats = "Total capacity is required";
    } else if (Number(formData.totalSeats) <= 0) {
      newErrors.totalSeats = "Total capacity must be greater than 0";
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    // Validate themes have names
    const themesValid = themes.every((t) => t.name.trim() !== "");
    if (!themesValid) {
      newErrors.themes = "All themes must have a name";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }, [formData, themes]);

  useEffect(() => {
    validateForm();
  }, [formData, themes, validateForm]);

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

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  // Theme handlers
  const addTheme = () => {
    setThemes((prev) => [
      ...prev,
      { name: "", images: [], previews: [], existingImages: [] },
    ]);
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

  const removeExistingImage = (themeIndex, imgIndex) => {
    setThemes((prev) =>
      prev.map((t, i) =>
        i === themeIndex
          ? {
              ...t,
              existingImages: t.existingImages.filter((_, j) => j !== imgIndex),
            }
          : t
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

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
        existingImages: t.existingImages || [],
      }));
      data.append("themes", JSON.stringify(themesMetadata));

      themes.forEach((theme) => {
        theme.images.forEach((img) => {
          data.append("themeImages", img);
        });
      });
    } else {
      // If all themes removed, send empty
      data.append("themes", JSON.stringify([]));
    }

    try {
      await dispatch(updateEvent({ id, formData: data })).unwrap();

      toast.success("Event Updated successfully!");

      setTimeout(() => {
        navigate("/organizer/events");
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Update Event Failed");
      console.error("update failed", err);
    }
  };

  return (
    <section className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 mt-4 mb-4">
      <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3">
        <FaEdit className="text-indigo-400" />
        Edit Event
      </h1>

      <p className="text-gray-300 mb-10">
        Update your event details and save changes.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Event Name</label>
          <div className="bg-white/20 border border-white/20 rounded-xl p-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <div className="bg-white/20 border border-white/20 rounded-xl p-3">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
            >
              <option value="" className="text-black">
                Select Category
              </option>
              {categoryLoading ? (
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
        </div>

        <div>
          <label className="block mb-2">Event Date & Time</label>
          <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
            <FaCalendarAlt className="text-gray-300" />
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              min={new Date().toISOString().slice(0, 16)}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          {errors.datetime && (
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
                value={formData.location}
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
            {errors.location && (
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
            {errors.pincode && (
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
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2">Price</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <TbCurrencyRupee />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {errors.price && (
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
                value={formData.totalSeats}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {errors.totalSeats && (
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
                  {(theme.existingImages?.length || 0) + theme.images.length}{" "}
                  photo(s) total
                </span>
              </div>

              {/* Existing images */}
              {theme.existingImages && theme.existingImages.length > 0 && (
                <div className="mb-2">
                  <p className="text-gray-400 text-xs mb-1">
                    Existing photos:
                  </p>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {theme.existingImages.map((img, imgIdx) => (
                      <div key={imgIdx} className="relative group">
                        <img
                          src={img.secure_url}
                          alt={`Existing ${imgIdx + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-white/10"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(themeIdx, imgIdx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New image previews */}
              {theme.previews.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs mb-1">New photos:</p>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {theme.previews.map((preview, imgIdx) => (
                      <div key={imgIdx} className="relative group">
                        <img
                          src={preview}
                          alt={`New ${imgIdx + 1}`}
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
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-semibold shadow-xl flex items-center justify-center gap-2 transition
            ${
              isFormValid
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-500 cursor-not-allowed opacity-60"
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
              <FaEdit /> Update Event
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default EditEvent;
