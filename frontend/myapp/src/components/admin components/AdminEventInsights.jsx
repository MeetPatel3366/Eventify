import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsWithStats } from "../../store/adminSlice";
import { getEventRatingSummary } from "../../store/reviewSlice";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaRupeeSign,
  FaUndo,
  FaUserShield,
  FaSearch,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminEventInsights = () => {
  const dispatch = useDispatch();
  const { eventsWithStats } = useSelector((state) => state.admin);
  const { summary } = useSelector((state) => state.review);

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
    dispatch(fetchEventsWithStats());
  }, [dispatch]);

  useEffect(() => {
    if (eventsWithStats?.length > 0) {
      eventsWithStats.forEach((event) => {
        const eventTime = new Date(event.datetime).getTime();
        if (eventTime < Date.now()) {
          dispatch(getEventRatingSummary(event._id));
        }
      });
    }
  }, [eventsWithStats, dispatch]);

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

  const filteredEvents = eventsWithStats
    .filter((event) =>
      event.name.toLowerCase().includes(filters.name.toLowerCase())
    )
    .filter((event) => {
      const eventDate = new Date(event.datetime);
      const today = new Date();

      if (filters.date === "today")
        return eventDate.toDateString() === today.toDateString();
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
      filters.category ? event.category.name === filters.category : true
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
      if (filters.revenue === "greater" && filters.revenueValue)
        return revenue > Number(filters.revenueValue);
      if (filters.revenue === "less" && filters.revenueValue)
        return revenue < Number(filters.revenueValue);
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
    <div className="min-h-[90vh] bg-[#020617] text-slate-100 p-8 font-sans box-border">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
        <div className="flex-shrink-0">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Event Insights
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium tracking-wide">
            Organizer performance and revenue distribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 flex-grow [color-scheme:dark]">
          <div className="relative min-w-[160px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search Event..."
              className="w-full bg-slate-900/60 pl-9 p-2 border border-slate-800 rounded-xl text-white text-xs outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="bg-slate-900/60 p-2 border border-slate-800 rounded-xl text-white text-xs outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 appearance-none min-w-[100px]"
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
              <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                <input
                  type="date"
                  className="bg-slate-900/60 p-1.5 border border-slate-800 rounded-lg text-white text-[10px] outline-none focus:border-cyan-500"
                  value={filters.customStart}
                  onChange={(e) =>
                    setFilters({ ...filters, customStart: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="bg-slate-900/60 p-1.5 border border-slate-800 rounded-lg text-white text-[10px] outline-none focus:border-cyan-500"
                  value={filters.customEnd}
                  onChange={(e) =>
                    setFilters({ ...filters, customEnd: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <select
            className="bg-slate-900/60 p-2 border border-slate-800 rounded-xl text-white text-xs outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 appearance-none min-w-[90px]"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="bg-slate-900/60 p-2 border border-slate-800 rounded-xl text-white text-xs outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 appearance-none min-w-[110px]"
            value={filters.occupancy}
            onChange={(e) =>
              setFilters({ ...filters, occupancy: e.target.value })
            }
          >
            <option value="">Occupancy</option>
            <option value="low">Low (0-30%)</option>
            <option value="medium">Med (30-70%)</option>
            <option value="high">High (70%+)</option>
          </select>

          <div className="flex items-center gap-2">
            <select
              className="bg-slate-900/60 p-2 border border-slate-800 rounded-xl text-white text-xs outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 appearance-none min-w-[110px]"
              value={filters.revenue}
              onChange={(e) =>
                setFilters({ ...filters, revenue: e.target.value })
              }
            >
              <option value="">Revenue Sort</option>
              <option value="high_low">High → Low</option>
              <option value="low_high">Low → High</option>
              <option value="greater">Revenue {`>`} X</option>
              <option value="less">Revenue {`<`} X</option>
            </select>

            {(filters.revenue === "greater" || filters.revenue === "less") && (
              <input
                type="number"
                placeholder="Value..."
                className="w-20 bg-slate-900/60 p-2 border border-slate-800 rounded-xl text-white text-xs outline-none focus:border-cyan-500 animate-in fade-in zoom-in-95"
                value={filters.revenueValue}
                onChange={(e) =>
                  setFilters({ ...filters, revenueValue: e.target.value })
                }
              />
            )}
          </div>

          <button
            onClick={resetFilters}
            className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/30 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
            title="Reset Filters"
          >
            <FaUndo size={12} />
          </button>
        </div>
      </header>

      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 rounded-[2rem] border border-dashed border-slate-800">
          <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
            No Results Found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const eventDate = new Date(event.datetime);
            const now = new Date();

            return (
              <NavLink
                key={event._id}
                to={`/admin/events/${event._id}/bookings`}
                className="group"
              >
                <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md transition-all duration-500 ">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={event.image?.secure_url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={event.name}
                    />
                    <div className="absolute top-4 left-4 bg-cyan-600 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                      {event.category.name}
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-lg font-bold text-white truncate mb-1">
                      {event.name}
                    </h2>
                    <div className="flex items-center gap-2 mb-4 text-[12px] text-slate-300  font-medium ">
                      <FaUserShield className="text-cyan-500/60" size={10} />
                      <span className="truncate">
                        {event.organizer.username}
                      </span>
                      <span>({event.organizer.email})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                        <FaCalendarAlt className="text-cyan-500/50" size={12} />
                        <span className="text-[10px] font-bold text-slate-300">
                          {eventDate.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                        <FaMapMarkerAlt
                          className="text-cyan-500/50"
                          size={12}
                        />
                        <span className="text-[10px] font-bold text-slate-300 truncate">
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[12px] text-slate-500 font-black uppercase mb-1.5 tracking-widest">
                          <span>Occupancy</span>
                          <span className="text-cyan-400">
                            {event.bookedSeats}/{event.totalSeats} (
                            {Math.round(
                              (event.bookedSeats / event.totalSeats) * 100
                            )}
                            %)
                          </span>
                        </div>
                        <div className="h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-1000"
                            style={{
                              width: `${
                                (event.bookedSeats / event.totalSeats) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                        <div>
                          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">
                            Net Revenue
                          </p>
                          <p className="text-xl font-black text-emerald-400 flex items-center">
                            <FaRupeeSign size={12} />
                            {event.totalRevenue.toLocaleString("en-IN")}
                          </p>
                        </div>
                        {eventDate < now && (
                          <div className="text-right">
                            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">
                              Avg Rating
                            </p>
                            {eventDate < now && summary[event._id] ? (
                              <div className="flex items-center justify-end gap-1 text-yellow-500 font-black">
                                <span className="text-lg leading-none">
                                  {summary[event._id].avg}
                                </span>
                                <FaStar size={10} />
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-700 font-bold">
                                No Data
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminEventInsights;
