import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, logout } from "../../store/authSlice";
import { FaUserCircle } from "react-icons/fa";
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getMyProfile());
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition font-medium ${
      isActive
        ? "bg-white/10 text-white"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={() => navigate("/admin")}
            className="text-2xl font-extrabold cursor-pointer text-white tracking-wide"
          >
            Eventify<span className="text-indigo-500">Admin</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/admin/home" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/pending-events" className={linkClass}>
              Pending Events
            </NavLink>
            <NavLink to="/admin/pending-organizers" className={linkClass}>
              Organizers
            </NavLink>
            <NavLink to="/admin/contact-messages" className={linkClass}>
              Contact Messages
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            <NavLink
              to="/admin/my-profile"
              className="flex items-center transition-all hover:opacity-80 active:scale-95"
            >
              {user?.profileImage?.secure_url ? (
                <img
                  src={user.profileImage.secure_url}
                  alt="Admin"
                  className="w-9 h-9 rounded-full object-cover border border-white/10 shadow-sm"
                />
              ) : (
                <FaUserCircle
                  size={28}
                  className="text-white/70 hover:text-white transition-colors"
                />
              )}
            </NavLink>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600/80 hover:bg-rose-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
