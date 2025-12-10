import React, { useState } from "react";
import "../../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In a real app, this is where you'd handle sending the message
    console.log("Form Data Submitted:", formData);

    // Simulate form submission
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>

      {submitted ? (
        <div className="contact-thankyou">
          <h2>Thank you for contacting us!</h2>
          <p>We have received your message and will get back to you shortly.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-primary">
            Submit
          </button>
        </form>
      )}

      <div className="contact-info">
        <h2>Get in Touch</h2>
        <ul>
          <li>
            <strong>Email:</strong> support@eventmanagement.com
          </li>
          <li>
            <strong>Phone:</strong> +123-456-7890
          </li>
          <li>
            <strong>Address:</strong> 123 Event Street, New York, NY 10001
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;
