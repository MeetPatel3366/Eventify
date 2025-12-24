import React, { useEffect } from "react";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyEvents } from "../../store/eventSlice";

export default function OrganizerDashboard() {
  const { myEvents, loading } = useSelector((state) => state.event)
  const dispatch = useDispatch()
  const today = new Date();
  const upcomingEvents = myEvents.filter((event) => new Date(event.date) >= today)

  const approvedEvents = myEvents.filter((e) => e.status == "approved").length;
  const pendingEvents = myEvents.filter((e) => e.status == "pending").length;

  useEffect(() => {
    dispatch(fetchMyEvents())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-6 py-16 mt-2">
      <section className="max-w-7xl mx-auto mb-14">
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
          <h3 className="text-xl font-semibold">Total Attendees</h3>
          <p className="text-4xl font-bold mt-2">--</p>
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
                  src={`http://localhost:4000/uploads/${event.image}`}
                  alt={event.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-1">
                    {event.name}
                  </h3>

                  <p className="text-gray-300 text-sm mb-2">
                    {new Date(event.date).toLocaleDateString()} • {event.location}
                  </p>

                  <p className="text-gray-400 text-sm mb-4 capitalize">
                    Category: {event.category}
                  </p>

                  <span
                    className={`inline-block px-4 py-1 text-sm rounded-full font-medium ${event.status === "approved"
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
    </div>
  );
}
