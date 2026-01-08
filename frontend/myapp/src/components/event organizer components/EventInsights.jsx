import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUndo,
  FaUsers,
} from "react-icons/fa";
import { fetchMyEventsWithStats } from "../../store/eventSlice";
import { NavLink } from "react-router-dom";

const EventInsights = () => {
  const dispatch = useDispatch();
  const { myEventStats } = useSelector((state) => state.event);

  const [filters, setFilters] = useState({
    name: "",
    date: "all",
    customStart: "",
    customEnd: "",
    location: "",
    category: "",
    status: "",
    occupancy: "",
    revenue: "",
    revenueValue: "",
  });

  useEffect(() => {
    dispatch(fetchMyEventsWithStats());
  }, [dispatch]);

  const resetFilters = () => {
    setFilters({
      name: "",
      date: "all",
      customStart: "",
      customEnd: "",
      location: "",
      category: "",
      status: "",
      occupancy: "",
      revenue: "",
      revenueValue: "",
    });
  };

  const filteredEvents = myEventStats
    .filter((event) =>
      event.name.toLowerCase().includes(filters.name.toLowerCase())
    )
    .filter((event) => {
      const eventDate = new Date(event.datetime);
      const today = new Date();

      if (filters.date === "today") {
        return eventDate.toDateString() === today.toDateString();
      }
      if (filters.date === "week") {
        const start = new Date();
        start.setDate(today.getDate() - today.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return eventDate >= start && eventDate <= end;
      }
      if (filters.date === "month") {
        return (
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      }
      if (filters.date === "custom") {
        if (!filters.customStart || !filters.customEnd) return true;
        const start = new Date(filters.customStart);
        const end = new Date(filters.customEnd);
        return eventDate >= start && eventDate <= end;
      }
      return true;
    })
    .filter((event) =>
      filters.location ? event.location === filters.location : true
    )
    .filter((event) =>
      filters.category ? event.category === filters.category : true
    )
    .filter((event) => {
      const now = new Date();
      const eventDate = new Date(event.datetime);

      if (filters.status === "active")
        return eventDate.toDateString() === now.toDateString();
      if (filters.status === "upcoming") return eventDate > now;
      if (filters.status === "completed") return eventDate < now;
      return true;
    })
    .filter((event) => {
      const occupancy = (event.bookedSeats / event.totalSeats) * 100;

      if (filters.occupancy === "low") return occupancy < 30;
      if (filters.occupancy === "medium")
        return occupancy >= 30 && occupancy <= 70;
      if (filters.occupancy === "high") return occupancy > 70;

      return true;
    })
    .filter((event) => {
      const revenue = event.totalRevenue;

      if (filters.revenue === "greater" && filters.revenueValue) {
        return revenue > Number(filters.revenueValue);
      }
      if (filters.revenue === "less" && filters.revenueValue) {
        return revenue < Number(filters.revenueValue);
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.revenue === "high_low")
        return b.totalRevenue - a.totalRevenue;
      if (filters.revenue === "low_high")
        return a.totalRevenue - b.totalRevenue;
      return 0;
    });

  return (
    <>
      <section className="max-w-7xl mx-auto mb-6 mt-4 flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold mb-3">Event Insights</h1>
          <p className="text-gray-300 text-lg">
            Track sales, attendance, and revenue for your active events.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search Event"
            className="bg-slate-800 p-2 border border-slate-700 rounded text-white"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />

          <select
            className="bg-slate-800 p-2 border border-slate-700 rounded text-white"
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
                className="bg-slate-800 p-2 border border-slate-700 rounded text-white col-span-1"
                value={filters.customStart}
                onChange={(e) =>
                  setFilters({ ...filters, customStart: e.target.value })
                }
              />
              <input
                type="date"
                className="bg-slate-800 p-2 border border-slate-700 rounded text-white col-span-1"
                value={filters.customEnd}
                onChange={(e) =>
                  setFilters({ ...filters, customEnd: e.target.value })
                }
              />
            </>
          )}

          <select
            className="bg-slate-800 p-2 border border-slate-700 rounded text-white"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          >
            <option value="">All Locations</option>
            {[...new Set(myEventStats.map((e) => e.location))].map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            className="bg-slate-800 p-2 border border-slate-700 rounded text-white"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            {[...new Set(myEventStats.map((e) => e.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="bg-slate-800 p-2 border border-slate-700 rounded text-white"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="bg-slate-800 p-2 border border-slate-700 rounded text-white"
            value={filters.occupancy}
            onChange={(e) =>
              setFilters({ ...filters, occupancy: e.target.value })
            }
          >
            <option value="">All Occupancy</option>
            <option value="low">Low (0-30%)</option>
            <option value="medium">Medium (30-70%)</option>
            <option value="high">High (70-100%)</option>
          </select>

          <select
            className="bg-slate-800 p-2 border border-slate-700 rounded text-white"
            value={filters.revenue}
            onChange={(e) =>
              setFilters({ ...filters, revenue: e.target.value })
            }
          >
            <option value="">Revenue</option>
            <option value="high_low">High → Low</option>
            <option value="low_high">Low → High</option>
            <option value="greater">Revenue {`>`} X</option>
            <option value="less">Revenue{` <`} X </option>
          </select>

          {(filters.revenue === "greater" || filters.revenue === "less") && (
            <input
              type="number"
              min={0}
              placeholder="Enter revenue"
              className="bg-slate-800 p-2 border border-slate-700 rounded text-white"
              value={filters.revenueValue}
              onChange={(e) =>
                setFilters({ ...filters, revenueValue: e.target.value })
              }
            />
          )}

          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
          >
            <FaUndo className="text-sm" /> Reset
          </button>
        </div>
      </section>

      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-lg">No events matching filters.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-16">
          {filteredEvents.map((event) => (
            <NavLink
              key={event._id}
              to={`/organizer/events/${event._id}/bookings`}
            >
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-colors">
                <div className="relative h-40">
                  <img
                    src={`http://localhost:4000/uploads/${event.image}`}
                    className="w-full h-full object-cover"
                    alt={event.name}
                  />
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded ">
                    {event.category}
                  </div>
                </div>

                <div className="px-5 py-3">
                  <h2 className="text-lg font-bold text-white truncate">
                    {event.name}
                  </h2>

                  <div className="mt-2 text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      {new Date(event.datetime).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 border-t border-slate-700 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 ">Price</span>
                      <p className="text-sm">₹{event.price}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 ">
                        Tickets Sold
                      </span>
                      <p className="text-sm">
                        {event.bookedSeats} / {event.totalSeats}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Occupancy</span>
                      <span className="text-indigo-400">
                        {Math.round(
                          (event.bookedSeats / event.totalSeats) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{
                          width: `${
                            (event.bookedSeats / event.totalSeats) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/50 flex justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold ">
                        Net Revenue
                      </span>
                      <p className="text-lg font-bold text-emerald-400 flex items-center">
                        <FaRupeeSign className="text-xs mr-1" />
                        {event.totalRevenue.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-slate-800 p-2 rounded border border-slate-700">
                      <FaUsers className="text-slate-400 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default EventInsights;
