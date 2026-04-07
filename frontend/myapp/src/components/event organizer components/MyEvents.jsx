import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaUndo,
  FaPalette,
  FaTimes,
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdPinDrop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchMyEvents } from "../../store/eventSlice";

const MyEvents = () => {
  const dispatch = useDispatch();
  const { myEvents } = useSelector((state) => state.event);

  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  return (
    <>
      {selectedTheme && (
        <div
          className="fixed inset-0 bg-black/70 z-[250] flex items-center justify-center p-4"
          onClick={() => setSelectedTheme(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTheme(null)}
              className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full transition-all"
            >
              <FaTimes size={14} />
            </button>

            {selectedTheme.images &&
            selectedTheme.images.length > 0 &&
            selectedTheme.images[0]?.secure_url ? (
              <img
                src={selectedTheme.images[0].secure_url}
                alt={selectedTheme.name}
                className="w-full h-[420px] object-cover"
              />
            ) : (
              <div className="w-full h-[420px] flex items-center justify-center bg-slate-800 text-slate-400 text-sm font-semibold">
                No Theme Image Available
              </div>
            )}

            <div className="p-4 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white capitalize">
                {selectedTheme.name}
              </h3>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto mb-6 mt-4 flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold mb-3">My Events</h1>
          <p className="text-gray-300 text-lg">
            Manage and track your event listings.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-16">
        {myEvents.map((event) => {
          const bookedSeats = event.totalSeats - event.availableSeats;
          const occupancyRate = (bookedSeats / event.totalSeats) * 100;

          return (
            <div
              key={event._id}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-colors"
            >
              <div className="relative h-52 bg-black flex items-center justify-center">
                <img
                  src={event.image}
                  className="max-h-full max-w-full object-contain"
                  alt={event.name}
                />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded">
                  {event.category.name}
                </div>
              </div>

              <div className="px-5 py-4">
                <h3 className="text-xl font-bold text-white truncate mb-2">
                  {event.name}
                </h3>

                <div className="text-xs text-slate-400 space-y-1 mb-3">
                  <p className="flex items-center gap-2">
                    <FaClock className="text-indigo-400" />
                    {new Date(event.datetime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <IoLocationSharp className="text-indigo-400" />
                    {event.location}
                  </p>
                  {event.pincode && (
                    <p className="flex items-center gap-2">
                      <MdPinDrop className="text-purple-400" />
                      {event.pincode}
                    </p>
                  )}
                </div>

                {event.themes && event.themes.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-purple-400">
                      <FaPalette /> {event.themes.length} Theme(s)
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {event.themes.map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedTheme(t)}
                          className="text-[10px] bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-2 py-1 rounded-full font-medium"
                        >
                          {t.name}
                        </button>
                      ))}

                      <button
                        className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full font-medium cursor-default"
                      >
                        Event Image
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                  {event.description}
                </p>

                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <FaUsers /> Capacity
                    </span>
                    <span>
                      {event.availableSeats} / {event.totalSeats}
                    </span>
                  </div>

                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  {event.status === "approved" && (
                    <span className="text-emerald-400 text-xs">
                      APPROVED
                    </span>
                  )}
                  {event.status === "pending" && (
                    <span className="text-yellow-400 text-xs">
                      PENDING
                    </span>
                  )}
                  {event.status === "rejected" && (
                    <span className="text-red-400 text-xs">
                      REJECTED
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  {(event.status === "pending" ||
                    event.status === "rejected") && (
                    <NavLink
                      to={`/organizer/events/edit/${event._id}`}
                      className="flex-1 text-center py-2 bg-indigo-600 text-white rounded-lg"
                    >
                      Edit
                    </NavLink>
                  )}

                  {event.status === "pending" && (
                    <button
                      onClick={() => dispatch(deleteEvent(event._id))}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MyEvents;