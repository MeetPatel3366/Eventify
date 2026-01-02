import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchMyEvents } from "../../store/eventSlice";

const MyEvents = () => {
  const dispatch = useDispatch();
  const { myEvents, loading } = useSelector((state) => state.event);
  console.log(myEvents);
  

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(id));
    }
  };

  const now = new Date();

  const statusPriority = {
    pending: 1,
    rejected: 2,
    approved: 3,
  };

  const sortedEvents = [...myEvents].sort((a, b) => {
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }

    if (a.status === "approved") {
      const aUpcoming = new Date(a.datetime) >= now;
      const bUpcoming = new Date(b.datetime) >= now;

      if (aUpcoming !== bUpcoming) {
        return bUpcoming - aUpcoming;
      }

      return new Date(a.datetime) - new Date(b.datetime);
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-6 py-16 mt-2">
      <section className="max-w-7xl mx-auto mb-12">
        <h1 className="text-5xl font-extrabold mb-3">My Events</h1>
        <p className="text-gray-300 text-lg">
          Manage all events you have created as an organizer.
        </p>
      </section>

      {loading && (
        <p className="text-center text-gray-300">Loading your events...</p>
      )}

      {!loading && myEvents.length > 0 && (
        <section className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedEvents.map((event) => {
            const bookedSeats = event.totalSeats - event.availableSeats;
            const occupancyRate = (bookedSeats / event.totalSeats) * 100;
            return(
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
                <h3 className="text-2xl font-semibold mb-1">{event.name}</h3>

                <p className="text-gray-300 text-sm mb-2 flex items-center gap-3">
                  <span>
                    {new Date(event.datetime).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{event.location}</span>
                </p>

                <p className="text-gray-400 text-sm mb-3 capitalize">
                  Category: {event.category}
                </p>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-gray-300 flex items-center gap-2">
                      <FaUsers className="text-indigo-400" /> Capacity
                    </span>
                    <span className="text-sm font-medium">
                      <span
                        className={
                          event.availableSeats === 0
                            ? "text-red-400"
                            : "text-white"
                        }
                      >
                        {event.availableSeats}
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        / {event.totalSeats} left
                      </span>
                    </span>
                  </div>

                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        occupancyRate >= 90 ? "bg-red-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  {event.status === "approved" && (
                    <span className="inline-flex items-center gap-2 px-4 py-1 text-sm rounded-full bg-green-600">
                      <FaCheckCircle /> Approved
                    </span>
                  )}

                  {event.status === "pending" && (
                    <span className="inline-flex items-center gap-2 px-4 py-1 text-sm rounded-full bg-yellow-600">
                      <FaClock /> Pending
                    </span>
                  )}

                  {event.status === "rejected" && (
                    <span className="inline-flex items-center gap-2 px-4 py-1 text-sm rounded-full bg-red-600">
                      <FaTimesCircle /> Rejected
                    </span>
                  )}
                </div>

                {event.status === "rejected" && (
                  <p className="text-red-300 text-sm mb-4">
                    Reason: {event.feedback || "No feedback provided"}
                  </p>
                )}

                <div className="flex gap-3">
                  {(event.status == "pending" ||
                    event.status == "rejected") && (
                    <NavLink
                      to={`/organizer/events/edit/${event._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition"
                    >
                      <FaEdit /> Edit
                    </NavLink>
                  )}

                  {event.status == "pending" && (
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )})}
        </section>
      )}

      {!loading && myEvents.length === 0 && (
        <div className="text-center mt-24 text-gray-300">
          <p className="text-xl">You haven’t created any events yet.</p>
          <NavLink
            to="/organizer/events/add"
            className="inline-block mt-6 px-8 py-3 bg-indigo-600 rounded-xl shadow-lg"
          >
            Create Your First Event
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
