import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-10 mt-2">Contact Us</h1>

      {submitted ? (
        <div className="max-w-xl mx-auto p-8 text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-3">Thank You!</h2>
          <p className="text-gray-300">
            We have received your message and will get back to you soon.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl space-y-5"
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

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-md font-semibold"
          >
            Submit
          </button>
        </form>
      )}

      <div className="max-w-xl mx-auto mt-14 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
        <ul className="space-y-2 text-gray-300">
          <li><strong>Email:</strong> support@eventmanagement.com</li>
          <li><strong>Phone:</strong> +123-456-7890</li>
          <li><strong>Address:</strong> 123 Event Street, New York, NY 10001</li>
        </ul>
      </div>

    </div>
  );
};

export default Contact;
