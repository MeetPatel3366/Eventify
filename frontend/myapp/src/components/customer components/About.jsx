import React from "react";
import "../../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <section className="about-intro">
        <h1>About Our Event Management System</h1>
        <p>
          Welcome to the Event Management System! Our platform is designed to
          help organizations and individuals seamlessly manage and participate
          in events. Whether you're planning a corporate conference, a musical
          festival, or a small community meetup, our system streamlines the
          process from start to finish.
        </p>
      </section>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to simplify event management by offering an all-in-one
          platform that connects event organizers with participants. We aim to
          provide an efficient, user-friendly, and scalable solution for events
          of any size.
        </p>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <ul>
          <li>
            Event Creation & Management: Easily set up and manage your events.
          </li>
          <li>
            Registration & Payment: Seamless registration and payment processing
            for participants.
          </li>
          <li>
            Real-time Updates: Stay informed with real-time updates about your
            event’s status.
          </li>
          <li>
            Analytics & Insights: Get detailed insights and reports on your
            event's performance.
          </li>
          <li>
            Customizable Event Pages: Create tailored event pages with detailed
            descriptions and media.
          </li>
        </ul>
      </section>

      <section className="benefits">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>
            <strong>User-Friendly:</strong> Our intuitive interface makes it
            easy for anyone to create and manage events.
          </li>
          <li>
            <strong>Scalable:</strong> Whether you're hosting a small gathering
            or a massive event, our system scales with your needs.
          </li>
          <li>
            <strong>Secure Payments:</strong> We ensure secure payment
            processing through trusted gateways.
          </li>
          <li>
            <strong>Customer Support:</strong> Our team is always here to help
            you with any questions or concerns.
          </li>
        </ul>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or need assistance, feel free to reach out
          to us:
        </p>
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
      </section>
    </div>
  );
};

export default About;
