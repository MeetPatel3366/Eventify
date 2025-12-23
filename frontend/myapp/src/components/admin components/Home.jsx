import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApprovedEvents, fetchPendingEvents, fetchRejectedEvents } from "../../store/adminSlice";
import { useDispatch } from "react-redux";

const AdminHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPendingEvents());
    dispatch(fetchApprovedEvents());
    dispatch(fetchRejectedEvents());
  }, [dispatch]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Evintify Admin Panel
        </h1>
        <p className="text-gray-400 mt-2">
          Manage events & organizers efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Pending Events", value: "0" },
          { label: "Pending Organizers", value: "0" },
          { label: "Approved Events", value: "0" },
          { label: "Total Users", value: "0" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg"
          >
            <h3 className="text-sm text-gray-300">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div
          onClick={() => navigate("/admin/pending-events")}
          className="group cursor-pointer bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 shadow-2xl hover:scale-[1.03] transition"
        >
          <h2 className="text-2xl font-bold mb-2">Pending Events</h2>
          <p className="text-blue-100 text-sm mb-6">
            Review and approve new event requests
          </p>
          <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm group-hover:bg-white/30">
            Manage →
          </span>
        </div>

        <div
          onClick={() => navigate("/admin/pending-organizers")}
          className="group cursor-pointer bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-6 shadow-2xl hover:scale-[1.03] transition"
        >
          <h2 className="text-2xl font-bold mb-2">Pending Organizers</h2>
          <p className="text-emerald-100 text-sm mb-6">
            Approve or reject organizer accounts
          </p>
          <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm group-hover:bg-white/30">
            Manage →
          </span>
        </div>

        <div
          onClick={() => navigate("/admin/events")}
          className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-6 shadow-2xl hover:scale-[1.03] transition"
        >
          <h2 className="text-2xl font-bold mb-2">Approved Events</h2>
          <p className="text-purple-100 text-sm mb-6">
            View and monitor approved events
          </p>
          <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm group-hover:bg-white/30">
            View →
          </span>
        </div>

        <div
          onClick={() => navigate("/admin/rejected")}
          className="group cursor-pointer bg-gradient-to-br from-rose-600 to-rose-800 rounded-3xl p-6 shadow-2xl hover:scale-[1.03] transition"
        >
          <h2 className="text-2xl font-bold mb-2">Rejected Requests</h2>
          <p className="text-rose-100 text-sm mb-6">
            Review rejected events & organizers
          </p>
          <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm group-hover:bg-white/30">
            View →
          </span>
        </div>
        <div
          onClick={() => navigate("/admin/rejected-events")}
          className="group cursor-pointer bg-gradient-to-br from-rose-600 to-rose-800 rounded-3xl p-6 shadow-2xl hover:scale-[1.03] transition"
        >
          <h2 className="text-2xl font-bold mb-2">Rejected Events</h2>
          <p className="text-rose-100 text-sm mb-6">
            Review rejected events
          </p>
          <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm group-hover:bg-white/30">
            View →
          </span>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;
