import React from "react";
import "../../styles/admin styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo"></div>
      <ul className="navbar-links">
        <li>
          <a href="/admin">Home</a>
        </li>
        <li>
          <a href="/admin/add-employee">Add Employee</a>
        </li>
        <li>
          <a href="/admin/manage-bookings">Manage Bookings</a>
        </li>
        <li>
          <a href="/admin/manage-events">Manage Events</a>
        </li>
        <li>
          <a href="/logout">Logout</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
