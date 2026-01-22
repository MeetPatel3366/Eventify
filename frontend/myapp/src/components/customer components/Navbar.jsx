import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { getMyProfile } from "../../store/authSlice";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getMyProfile());
    }
  }, []);
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/home"
          className="text-white text-2xl font-extrabold tracking-wide hover:opacity-80 transition"
        >
          Eventify
        </Link>

        <ul className="flex items-center gap-8 text-sm text-gray-200 font-medium">
          <li>
            <NavLink
              className="hover:text-indigo-400 transition-colors"
              to="/home"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-indigo-400 transition-colors"
              to="/events"
            >
              Events
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-indigo-400 transition-colors"
              to="/event-progress"
            >
              Progress
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-indigo-400 transition-colors"
              to="/my-bookings"
            >
              My Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-indigo-400 transition-colors"
              to="/about"
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-indigo-400 transition-colors"
              to="/contact"
            >
              Contact Us
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink
                to="/my-profile"
                className="flex items-center justify-center transition-all hover:scale-110"
              >
                {user?.profileImage?.secure_url ? (
                  <img
                    src={user.profileImage.secure_url}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-md"
                  />
                ) : (
                  <FaUserCircle
                    size={28}
                    className="text-white hover:text-indigo-400"
                  />
                )}
              </NavLink>
            </li>
          )}

          <li>
            <NavLink
              to="/logout"
              className="ml-4 px-5 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
