import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900 border-b border-white/10 px-6 py-4 flex justify-between items-center text-white shadow-md">
      <div
        onClick={() => navigate("/organizer/home")}
        className="text-2xl font-extrabold cursor-pointer text-white tracking-wide"
      >
        Eventify<span className="text-indigo-500">Organizer</span>
      </div>

      <div className="flex gap-6 items-center">
        <NavLink to="/organizer/home" className="hover:text-indigo-400">
          Home
        </NavLink>
        <NavLink to="/organizer/dashboard" className="hover:text-indigo-400">
          Dashboard
        </NavLink>
        <NavLink to="/organizer/events" className="hover:text-indigo-400">
          My Events
        </NavLink>
        <NavLink to="/organizer/events-stats" className="hover:text-indigo-400">
          Event Insights
        </NavLink>
        <NavLink to="/organizer/events/add" className="hover:text-indigo-400">
          Add Event
        </NavLink>

        <button
          onClick={() => navigate("/logout")}
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
