import React from "react";
import "../../styles/Home.css";

const Home = () => {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-card">
          <h1>Welcome to Eventify</h1>
          <p>Your all-in-one platform to plan, manage and celebrate your events effortlessly.</p>

          <a href="/customer/events" className="btn-explore">
            Explore Events
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
