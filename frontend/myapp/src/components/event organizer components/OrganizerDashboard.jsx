import React, { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaChartLine,
  FaListUl,
  FaUndoAlt,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyEvents, fetchMyEventsWithStats } from "../../store/eventSlice";
import { fetchRefundRequests, approveRefund } from "../../store/bookingSlice";

export default function OrganizerDashboard() {
  const { myEvents, myEventStats, loading } = useSelector(
    (state) => state.event,
  );
  const { refundRequests } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const today = new Date();
  const upcomingEvents = myEvents.filter(
    (event) => new Date(event.datetime) >= today,
  );

  const approvedEvents = myEvents.filter((e) => e.status == "approved").length;
  const pendingEvents = myEvents.filter((e) => e.status == "pending").length;

  const stats = useMemo(() => {
    return myEventStats?.reduce(
      (accum, curr) => ({
        totalRevenue: accum.totalRevenue + curr.totalRevenue,
        totalBooked: accum.totalBooked + curr.bookedSeats,
      }),
      { totalRevenue: 0, totalBooked: 0 },
    );
  }, [myEventStats]);

  useEffect(() => {
    dispatch(fetchMyEvents());
    dispatch(fetchMyEventsWithStats());
    dispatch(fetchRefundRequests());
  }, [dispatch]);

  const handleApprove = async (bookingId) => {
    setProcessingId(bookingId);
    await dispatch(approveRefund(bookingId));
    dispatch(fetchRefundRequests());
    dispatch(fetchMyEventsWithStats()); // update revenue
    setProcessingId(null);
  };

  return (
    <>
      <section className="max-w-7xl mx-auto mb-14 mt-4">
        <h1 className="text-5xl font-extrabold mb-3">Organizer Dashboard</h1>
        <p className="text-gray-300 text-lg">
          Overview of your events, approvals, and attendees.
        </p>
      </section>

      <section className="max-w-7xl mx-auto mb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
          <FaCalendarAlt className="text-indigo-400 mb-4" size={32} />
          <h3 className="text-xl font-semibold">Total Events</h3>
          <p className="text-4xl font-bold mt-2">{myEvents.length}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
          <FaCheckCircle className="text-green-400 mb-4" size={32} />
          <h3 className="text-xl font-semibold">Approved Events</h3>
          <p className="text-4xl font-bold mt-2">{approvedEvents}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
          <FaClock className="text-yellow-400 mb-4" size={32} />
          <h3 className="text-xl font-semibold">Pending Approval</h3>
          <p className="text-4xl font-bold mt-2">{pendingEvents}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
          <FaUsers className="text-indigo-400 mb-4" size={32} />
          <h3 className="text-xl font-semibold">Total Bookings</h3>
          <p className="text-4xl font-bold mt-2">{stats.totalBooked}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
          <FaChartLine className="text-green-400 mb-4" size={32} />
          <h3 className="text-xl font-semibold">Total Revenue</h3>
          <p className="text-4xl font-bold mt-2">₹ {stats.totalRevenue}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
          <FaListUl className="text-indigo-400 mb-4" size={32} />
          <h3 className="text-xl font-semibold">Upcoming Events</h3>
          <p className="text-4xl font-bold mt-2">{upcomingEvents.length}</p>
        </div>

        <div 
          onClick={() => setShowRefundModal(true)}
          className="bg-white/10 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-6 shadow-xl cursor-pointer hover:bg-orange-500/10 transition-colors"
        >
          <FaUndoAlt className="text-orange-400 mb-4" size={32} />
          <h3 className="text-xl font-semibold">Refund Requests</h3>
          <p className="text-4xl font-bold mt-2 text-orange-400">{refundRequests?.length || 0}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mb-20">
        <h2 className="text-4xl font-semibold mb-10">My Upcoming Events</h2>

        {loading ? (
          <p className="text-gray-300">Loading events...</p>
        ) : myEvents.length === 0 ? (
          <p className="text-gray-300">No events created yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-1">{event.name}</h3>

                  <p className="text-gray-300 text-sm mb-2">
                    {new Date(event.date).toLocaleDateString()} •{" "}
                    {event.location}
                  </p>

                  <p className="text-gray-400 text-sm mb-4 capitalize">
                    Category: {event.category.name}
                  </p>

                  <span
                    className={`inline-block px-4 py-1 text-sm rounded-full font-medium ${
                      event.status === "approved"
                        ? "bg-green-600"
                        : event.status === "pending"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }`}
                  >
                    {event.status}
                  </span>

                  {event.status === "rejected" && (
                    <p className="text-red-300 text-sm mt-3">
                      Reason: {event.feedback || "No feedback provided"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-4xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-400">
                <FaUndoAlt /> Pending Refund Requests
              </h2>
              <button
                onClick={() => setShowRefundModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 hover:bg-slate-700 rounded-full"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 scrollbar-hide">
              {refundRequests?.length === 0 ? (
                <div className="text-center text-slate-500 py-10 font-bold uppercase tracking-widest">
                  No pending refund requests
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-950 text-slate-500 uppercase text-[10px] font-black tracking-widest sticky top-0">
                    <tr>
                      <th className="p-4 rounded-tl-xl">Event</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4 text-center">Amount</th>
                      <th className="p-4 text-center">Date</th>
                      <th className="p-4 text-center rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {refundRequests?.map((req) => (
                      <tr key={req._id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 text-slate-200 font-bold max-w-[200px] truncate">
                          {req.eventId?.name}
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 font-medium">{req.userId?.username}</p>
                          <p className="text-slate-500 text-[10px]">{req.userId?.email}</p>
                        </td>
                        <td className="p-4 text-center font-bold text-orange-400 font-mono text-lg">
                          ₹{req.totalAmount}
                        </td>
                        <td className="p-4 text-center text-slate-400 text-xs">
                          {new Date(req.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleApprove(req._id)}
                            disabled={processingId === req._id}
                            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded-xl text-xs font-bold w-full transition-all"
                          >
                            {processingId === req._id ? (
                              "Processing..."
                            ) : (
                              <>
                                <FaCheck /> Approve
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
