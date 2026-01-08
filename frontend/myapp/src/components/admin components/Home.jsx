import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import AdminCard from "./AdminCard";

const AdminHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.admin);

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

  return (
    <>
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Evintify Admin Panel
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor platform activity & approvals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-14">
        {[
          {
            label: "Total Users",
            value: stats?.totalUsers,
            path: "/admin/users",
          },
          {
            label: "Active Organizers",
            value: stats?.approvedOrganizers,
            path: "/admin/approved-organizers",
          },
          { label: "Total Events", value: stats?.totalEvents },
          { label: "Past Events", value: stats?.pastEvents },
          { label: "Upcoming Events", value: stats?.upcomingEvents },
          {
            label: "Confirmed Bookings",
            value: stats?.allBookings,
            path: "/admin/all-bookings",
          },
        ].map((stat, index) => (
          <div
            key={index}
            onClick={() => stat.path && navigate(stat.path)}
            className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6
            border border-white/10 shadow-xl
            hover:bg-white/15 hover:-translate-y-1 transition-all text-center"
          >
            <h3 className="text-sm text-gray-400 tracking-wide">
              {stat.label}
            </h3>
            <p className="text-3xl font-bold mt-3">{stat.value || 0}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-14">
        <AdminCard
          title="Pending Events"
          description="Review and approve new event requests"
          count={stats?.pendingEvents}
          color="from-blue-600 to-blue-800"
          onClick={() => navigate("/admin/pending-events")}
        />

        <AdminCard
          title="Approved Events"
          description="View and monitor approved events"
          count={stats?.approvedEvents}
          color="from-emerald-600 to-emerald-800"
          onClick={() => navigate("/admin/events")}
        />

        <AdminCard
          title="Rejected Events"
          description="Review rejected events"
          count={stats?.rejectedEvents}
          color="from-rose-600 to-rose-800"
          onClick={() => navigate("/admin/rejected-events")}
        />

        <AdminCard
          title="Pending Organizers"
          description="Approve or reject organizer accounts"
          count={stats?.pendingOrganizers}
          color="from-blue-600 to-blue-800"
          onClick={() => navigate("/admin/pending-organizers")}
        />

        <AdminCard
          title="Approved Organizers"
          description="View approved organizers"
          count={stats?.approvedOrganizers}
          color="from-emerald-600 to-emerald-800"
          onClick={() => navigate("/admin/approved-organizers")}
        />

        <AdminCard
          title="Rejected Requests"
          description="View rejected organizers"
          count={stats?.rejectedOrganizers}
          color="from-rose-600 to-rose-800"
          onClick={() => navigate("/admin/rejected-organizers")}
        />
      </div>
    </>
  );
};

export default AdminHome;
