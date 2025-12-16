import { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaAlignLeft,
  FaPlusCircle,
} from "react-icons/fa";
import { TbCurrencyRupee } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { addEvent } from "../../store/eventSlice";
import { useNavigate } from "react-router-dom"

export default function AddEvent() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    datetime: "",
    location: "",
    description: "",
    price: "",
    image: null,
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
      await dispatch(addEvent(data)).unwrap()
      navigate("/organizer/events")
    } catch (error) {
      console.log("add event failed : ", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-6 py-16">
      <section className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10">
        <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3">
          <FaPlusCircle className="text-indigo-400" />
          Create New Event
        </h1>
        <p className="text-gray-300 mb-10">
          Fill in the details below. Your event will be submitted for admin approval.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2" id="name">Event Name</label>
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
            <label className="block mb-2" id="category">Category</label>
            <div className="flex items-center gap-3 bg-white/20 border border-white/20 rounded-xl p-3">
              <input
                type="text"
                name="category"
                id="category"
                required
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" id="datetime">Event Date & Time</label>
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
            <label className="block mb-2" id="location">Location</label>
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
            <label className="block mb-2" id="description">Description</label>
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

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2" id="price">Price</label>
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
              <label className="block mb-2" id="image">Event Image</label>
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
    </div>
  );
}
