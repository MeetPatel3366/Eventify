import { useEffect, useState } from "react";
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

const EditEvent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading } = useSelector((state) => state.event);

  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.category,
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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

  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  const toLocalDateTime = (utcDate) => {
    const date = new Date(utcDate);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        category: event.category || "",
        datetime: toLocalDateTime(event.datetime),
        location: event.location || "",
        description: event.description || "",
        price: event.price || "",
        totalSeats: event.totalSeats || "",
        image: null,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      await dispatch(updateEvent({ id, formData: data })).unwrap();
      navigate("/organizer/events");
    } catch (err) {
      console.error("update failed", err);
    }
  };

  if (loading) {
    return <p className="text-center text-white py-20">Loading...</p>;
  }

  return (
    <>
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
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Category</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <select
                name="category"
                id="category"
                required
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
                    <option
                      key={cat._id}
                      value={cat._id}
                      className="text-black"
                    >
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
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Location</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaMapMarkerAlt className="text-gray-300" />
              <input
                type="text"
                name="location"
                value={formData.location}
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
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
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2">Price</label>
              <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
                <TbCurrencyRupee className="text-gray-300 text-2xl" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  required
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Total Capacity</label>
              <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
                <FaUsers className="text-gray-300 text-xl" />
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  required
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Event Image</label>
              <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
                <FaImage className="text-gray-300" />
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
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold shadow-xl flex items-center justify-center gap-2"
          >
            <FaEdit /> Update Event
          </button>
        </form>
      </section>
    </>
  );
};

export default EditEvent;
