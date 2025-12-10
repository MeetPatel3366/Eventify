import React from "react";
import "../../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo"></div>
      <ul className="navbar-links">
        <li>
          <a href="/customer">Home</a>
        </li>
        <li>
          <a href="/customer/events">Events</a>
        </li>
        <li>
          <a href="/customer/event-progress">Events Progress</a>
        </li>
        <li>
          <a href="/customer/recent-bookings">Recent Bookings</a>
        </li>
        <li>
          <a href="/customer/about">About</a>
        </li>
        <li>
          <a href="/customer/contact">Contact</a>
        </li>
        <li>
          <a href="/logout">Logout</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
