import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <nav className="bg-slate-900 border-b border-white/10 px-6 py-4 flex justify-between items-center text-white">
      <h1 className="text-xl font-bold text-indigo-400">Eventify</h1>

      <div className="flex gap-6 items-center">
        <NavLink to="/organizer" className="hover:text-indigo-400">Home</NavLink>
        <NavLink to="/organizer/dashboard" className="hover:text-indigo-400">
          Dashboard
        </NavLink>
        <NavLink to="/organizer/events" className="hover:text-indigo-400">
          My Events
        </NavLink>
        <NavLink to="/organizer/events/add" className="hover:text-indigo-400">
          Add Event
        </NavLink>
        <NavLink to="/events" className="hover:text-indigo-400">
          All Events
        </NavLink>

        <button
          onClick={() => dispatch(logout())}
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;