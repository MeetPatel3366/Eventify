import { useState } from "react";
import styles from "../../styles/Contact.module.css"; 

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
    console.log("Form Data Submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className={styles['contact-page']}>
      <h1>Contact Us</h1>

      {submitted ? (
        <div className={styles['contact-thankyou']}>
          <h2>Thank you for contacting us!</h2>
          <p>We have received your message and will get back to you shortly.</p>
        </div>
      ) : (
        <form className={styles['contact-form']} onSubmit={handleSubmit}>
          <div className={styles['contact-form-group']}>
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

          <div className={styles['contact-form-group']}>
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

          <div className={styles['contact-form-group']}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <button type="submit" className={styles['btn-primary']}>
            Submit
          </button>
        </form>
      )}

      <div className={styles['contact-info']}>
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