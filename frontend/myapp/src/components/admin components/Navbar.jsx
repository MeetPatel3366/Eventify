import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo"></div>
      <ul className="navbar-links">
        <li>
          <Link to="/admin">Home</Link>
        </li>
        <li>
          <Link to="/admin/add-employee">Add Employee</Link>
        </li>
        <li>
          <Link to="/admin/manage-bookings">Manage Bookings</Link>
        </li>
        <li>
          <Link to="/admin/manage-events">Manage Events</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
