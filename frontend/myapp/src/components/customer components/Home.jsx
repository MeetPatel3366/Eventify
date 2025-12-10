import React from "react";
import "../../styles/Home.css";

const Home = () => {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to the Event Management System</h1>
          <p>Plan, manage, and track all your events in one place!</p>
          <a href="/customer/events" className="btn-primary">
            Explore Events
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
