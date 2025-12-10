import React from "react";
import "../../styles/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo"></div>
      <ul className="navbar-links">
        <li>
          <Link to="/customer">Home</Link>
        </li>
        <li>
          <Link to="/customer/events">Events</Link>
        </li>
        <li>
          <Link to="/customer/event-progress">Events Progress</Link>
        </li>
        <li>
          <Link to="/customer/recent-bookings">Recent Bookings</Link>
        </li>
        <li>
          <Link to="/customer/about">About</Link>
        </li>
        <li>
          <Link to="/customer/contact">Contact</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
