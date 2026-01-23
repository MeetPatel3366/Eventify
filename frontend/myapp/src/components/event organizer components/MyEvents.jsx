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
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchMyEvents } from "../../store/eventSlice";

const MyEvents = () => {
  const dispatch = useDispatch();
  const { myEvents } = useSelector((state) => state.event);

  const defaultFilters = {
    date: "all",
    location: "",
    category: "",
    status: "",
    occupancy: "",
    revenue: "",
    customStart: "",
    customEnd: "",
    search: "",
  };

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const filterByDate = (event) => {
    const eventDate = new Date(event.datetime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(
      today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1),
    );

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    switch (filters.date) {
      case "today":
        return eventDate.toDateString() === today.toDateString();
      case "week":
        return eventDate >= weekStart && eventDate <= weekEnd;
      case "month":
        return (
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      case "custom":
        if (!filters.customStart || !filters.customEnd) return true;
        return (
          eventDate >= new Date(filters.customStart) &&
          eventDate <= new Date(filters.customEnd)
        );
      default:
        return true;
    }
  };

  const getOccupancyRate = (event) => {
    const booked = event.totalSeats - event.availableSeats;
    return (booked / event.totalSeats) * 100;
  };

  const uniqueLocations = [...new Set(myEvents.map((e) => e.location))];
  const uniqueCategories = [
    ...new Set(myEvents.map((e) => e.category?.name).filter(Boolean)),
  ];

  const filteredEvents = myEvents
    .filter(filterByDate)
    .filter((e) =>
      filters.search
        ? e.name.toLowerCase().includes(filters.search.toLowerCase())
        : true,
    )
    .filter((e) => (filters.location ? e.location === filters.location : true))
    .filter((e) =>
      filters.category ? e.category?.name === filters.category : true,
    )
    .filter((e) => (filters.status ? e.status === filters.status : true))
    .filter((e) => {
      const occ = getOccupancyRate(e);
      if (filters.occupancy === "low") return occ <= 30;
      if (filters.occupancy === "mid") return occ > 30 && occ <= 70;
      if (filters.occupancy === "high") return occ > 70;
      return true;
    })
    .sort((a, b) => {
      if (filters.revenue === "high") return b.revenue - a.revenue;
      if (filters.revenue === "low") return a.revenue - b.revenue;
      return 0;
    });

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <>
      <section className="max-w-7xl mx-auto mb-6 mt-4 flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold mb-3">My Events</h1>
          <p className="text-gray-300 text-lg">
            Manage and track your event listings.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search Event"
            className="bg-slate-800 p-3 border border-slate-700 rounded text-white"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <select
            className="bg-slate-800 p-3 border border-slate-700 rounded text-white"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>

          {filters.date === "custom" && (
            <>
              <input
                type="date"
                className="bg-slate-800 p-3 border border-slate-700 rounded text-white col-span-1"
                value={filters.customStart}
                onChange={(e) =>
                  setFilters({ ...filters, customStart: e.target.value })
                }
              />
              <input
                type="date"
                className="bg-slate-800 p-3 border border-slate-700 rounded text-white col-span-1"
                value={filters.customEnd}
                onChange={(e) =>
                  setFilters({ ...filters, customEnd: e.target.value })
                }
              />
            </>
          )}

          <select
            className="bg-slate-800 p-3 border border-slate-700 rounded text-white"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            className="bg-slate-800 p-3 border border-slate-700 rounded text-white"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="bg-slate-800 p-3 border border-slate-700 rounded text-white"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="bg-slate-800 p-3 border border-slate-700 rounded text-white"
            value={filters.occupancy}
            onChange={(e) =>
              setFilters({ ...filters, occupancy: e.target.value })
            }
          >
            <option value="">All Occupancy</option>
            <option value="low">Low (0-30%)</option>
            <option value="mid">Medium (30-70%)</option>
            <option value="high">High (70-100%)</option>
          </select>

          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
          >
            <FaUndo className="text-sm" /> Reset
          </button>
        </div>
      </section>

      {filteredEvents.length === 0 ? (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-lg">No events matching filters.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-16">
          {filteredEvents.map((event) => {
            const bookedSeats = event.totalSeats - event.availableSeats;
            const occupancyRate = (bookedSeats / event.totalSeats) * 100;

            return (
              <div
                key={event._id}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-colors"
              >
                <div className="relative h-44">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded">
                    {event.category.name}
                  </div>
                </div>

                <div className="px-5 py-4">
                  <h3 className="text-xl font-bold text-white truncate mb-1">
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
                      <span className="truncate">{event.location}</span>
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {event.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-indigo-400" /> Capacity
                      </span>
                      <span>
                        {event.availableSeats} / {event.totalSeats} left
                      </span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          occupancyRate >= 90 ? "bg-red-500" : "bg-indigo-500"
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    {event.status === "approved" && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <FaCheckCircle /> APPROVED
                      </span>
                    )}
                    {event.status === "pending" && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        <FaClock /> PENDING
                      </span>
                    )}
                    {event.status === "rejected" && (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          <FaTimesCircle /> REJECTED
                        </span>
                        <p className="text-[10px] text-red-300 italic">
                          {event.feedback || "No feedback provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {(event.status === "pending" ||
                      event.status === "rejected") && (
                      <NavLink
                        to={`/organizer/events/edit/${event._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white"
                      >
                        <FaEdit /> Edit
                      </NavLink>
                    )}

                    {event.status === "pending" && (
                      <button
                        onClick={() => dispatch(deleteEvent(event._id))}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MyEvents;
