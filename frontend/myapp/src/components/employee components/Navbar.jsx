import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo"></div>
      <ul className="navbar-links">
        <li>
          <Link to="/employee">Home</Link>
        </li>
        <li>
          <Link to="/employee/manage-tasks">Manage Events</Link>
        </li>
        <li>
          <Link to="/employee/work-status-updates">Work Status Updates</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
