import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="text-white text-2xl font-extrabold tracking-wide">
          Eventify
        </div>

        <ul className="flex items-center gap-6 text-white font-medium">
          <li>
            <Link className="hover:text-indigo-300 transition" to="/home">Home</Link>
          </li>
          <li>
            <Link className="hover:text-indigo-300 transition" to="/events">Events</Link>
          </li>
          <li>
            <Link className="hover:text-indigo-300 transition" to="/event-progress">Events Progress</Link>
          </li>
          <li>
            <Link className="hover:text-indigo-300 transition" to="/recent-bookings">Recent Bookings</Link>
          </li>
          <li>
            <Link className="hover:text-indigo-300 transition" to="/about">About</Link>
          </li>
          <li>
            <Link className="hover:text-indigo-300 transition" to="/contact">Contact</Link>
          </li>

          <li>
            <Link
              to="/logout"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-500/30 transition"
            >
              Logout
            </Link>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
