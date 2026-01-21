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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
      data.append(key, formData[key]);
    });
    console.log("submitted event:", Object.fromEntries(data));

    try {
      await dispatch(addEvent(data)).unwrap();
      navigate("/organizer/events");
    } catch (error) {
      console.log("add event failed : ", error.message);
    }
  };

  return (
    <>
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
            <label className="block mb-2" id="name">
              Event Name
            </label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <input
                type="text"
                name="name"
                id="name"
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" id="category">
              Category
            </label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <select
                name="category"
                id="category"
                required
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
            <label className="block mb-2" id="datetime">
              Event Date & Time
            </label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaCalendarAlt className="text-gray-300" />
              <input
                type="datetime-local"
                name="datetime"
                id="datetime"
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" id="location">
              Location
            </label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaMapMarkerAlt className="text-gray-300" />
              <input
                type="text"
                name="location"
                id="location"
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" id="description">
              Description
            </label>
            <div className="flex gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <FaAlignLeft className="text-gray-300 mt-1" />
              <textarea
                name="description"
                id="description"
                rows="4"
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2" id="price">
                Price
              </label>
              <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
                <TbCurrencyRupee className="text-gray-300 text-2xl" />
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2" htmlFor="totalSeats">
                Total Capacity
              </label>
              <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
                <FaUsers className="text-gray-300 text-xl" />
                <input
                  type="number"
                  name="totalSeats"
                  id="totalSeats"
                  required
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2" id="image">
                Event Image
              </label>
              <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
                <FaImage className="text-gray-300" />
                <input
                  type="file"
                  name="image"
                  id="image"
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
            <FaPlusCircle /> Submit Event for Approval
          </button>
        </form>
      </section>
    </>
  );
}
