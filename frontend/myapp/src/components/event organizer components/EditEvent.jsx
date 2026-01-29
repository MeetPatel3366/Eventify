import { useEffect, useState, useCallback } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaAlignLeft,
  FaEdit,
  FaUsers,
} from "react-icons/fa";
import { TbCurrencyRupee } from "react-icons/tb";
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
    image: null,
  });

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
        image: null,
      });
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

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const formatLocation = (value) =>
    value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let val = files ? files[0] : value;

    if (name === "location" && typeof val === "string") {
      val = formatLocation(val);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

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
