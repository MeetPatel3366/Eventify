import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminStats,
  fetchAllUsers,
  fetchApprovedEvents,
  fetchApprovedOrganizers,
  fetchPendingEvents,
  fetchPendingOrganizers,
  fetchRejectedEvents,
  fetchRejectedOrganizers,
} from "../../store/adminSlice";
import AdminCard from "./AdminCard";
import { BarChart3 } from "lucide-react";

const AdminHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.admin);
  console.log("stats : ", stats);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchPendingEvents());
    dispatch(fetchApprovedEvents());
    dispatch(fetchRejectedEvents());
    dispatch(fetchPendingOrganizers());
    dispatch(fetchApprovedOrganizers());
    dispatch(fetchRejectedOrganizers());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const statConfig = [
    { label: "Total Users", value: stats?.totalUsers, path: "/admin/users" },
    {
      label: "Active Organizers",
      value: stats?.approvedOrganizers,
      path: "/admin/approved-organizers",
    },
    { label: "Total Events", value: stats?.totalEvents },
    { label: "Past Events", value: stats?.pastEvents },
    { label: "Upcoming Events", value: stats?.upcomingEvents },
    {
      label: "Bookings",
      value: stats?.allBookings,
      path: "/admin/all-bookings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-8 font-sans">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-16">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium tracking-wide">
            Platform oversight and administrative control hub.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/booking-analytics")}
          className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.3)]"
        >
          <BarChart3 size={20} />
          View Analytics Dashboard
        </button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
        {statConfig.map((stat, index) => (
          <div
            key={index}
            onClick={() => stat.path && navigate(stat.path)}
            className={`group p-6 rounded-[2rem] border border-slate-800 bg-slate-900/40 backdrop-blur-md transition-all duration-300 ${
              stat.path ? "cursor-pointer " : ""
            }`}
          >
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-slate-300 transition-colors">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black text-slate-100 font-mono tracking-tighter group-hover:text-cyan-400 transition-colors">
              {stat.value || 0}
            </h3>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-10">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-100 border-b-2 border-cyan-500/30 pb-1">
          Management Console
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
        <AdminCard
          title="Pending Events"
          description="Review and approve new event requests"
          count={stats?.pendingEvents}
          color="from-blue-600 to-blue-900"
          onClick={() => navigate("/admin/pending-events")}
        />

        <AdminCard
          title="Approved Events"
          description="View and monitor approved events"
          count={stats?.approvedEvents}
          color="from-emerald-600 to-emerald-900"
          onClick={() => navigate("/admin/events")}
        />

        <AdminCard
          title="Rejected Events"
          description="Review historical rejected events"
          count={stats?.rejectedEvents}
          color="from-rose-600 to-rose-900"
          onClick={() => navigate("/admin/rejected-events")}
        />

        <AdminCard
          title="Pending Organizers"
          description="Validate new organizer credentials"
          count={stats?.pendingOrganizers}
          color="from-indigo-600 to-indigo-900"
          onClick={() => navigate("/admin/pending-organizers")}
        />

        <AdminCard
          title="Active Organizers"
          description="View verified event organizers"
          count={stats?.approvedOrganizers}
          color="from-sky-600 to-sky-900"
          onClick={() => navigate("/admin/approved-organizers")}
        />

        <AdminCard
          title="Blacklist Organizers"
          description="Manage rejected organizer requests"
          count={stats?.rejectedOrganizers}
          color="from-slate-700 to-slate-900"
          onClick={() => navigate("/admin/rejected-organizers")}
        />
        <AdminCard
          title="Event Categories"
          description="Manage festival, concert, and workshop types"
          count={stats?.totalCategories}
          color="from-violet-600 to-violet-900"
          onClick={() => navigate("/admin/eventcategories")}
        />
      </div>
    </div>
  );
};

export default AdminHome;
