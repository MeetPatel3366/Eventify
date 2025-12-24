import { useState } from "react";
import axios from "axios"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(import.meta.env.VITE_BACKEND_URL);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/contact/`, formData, { withCredentials: true });
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        message: "",
      })

      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("failed to send message. please try again.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-6 py-16">
      <section className="max-w-6xl mx-auto text-center mb-6 mt-6">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-300 text-lg">
          Have questions or need help? We’re here to assist you.
        </p>
      </section>

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="Contact Support"
          className="rounded-3xl shadow-2xl border border-white/20"
        />

        {submitted ? (
          <div className="p-10 text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-semibold mb-3">Thank You!</h2>
            <p className="text-gray-300 text-lg">
              Your message has been received. Our team will contact you shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl space-y-6"
          >
            <div>
              <label className="block mb-1 text-gray-200">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-200">Message</label>
              <textarea
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </section>

      <section className="max-w-6xl mx-auto mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center shadow-xl">
          <h3 className="text-2xl font-semibold mb-2">Email</h3>
          <p className="text-gray-300">support@eventify.com</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center shadow-xl">
          <h3 className="text-2xl font-semibold mb-2">Phone</h3>
          <p className="text-gray-300">+123-456-7890</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center shadow-xl">
          <h3 className="text-2xl font-semibold mb-2">Address</h3>
          <p className="text-gray-300">123 Event Street, New York, NY</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
