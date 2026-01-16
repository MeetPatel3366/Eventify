import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaListAlt,
  FaDownload,
  FaUndo,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { fetchEventBookings } from "../../store/adminSlice";

const EventBookings = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEvent, eventBookings, loading } = useSelector(
    (state) => state.admin
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchEventBookings(eventId));
  }, [dispatch, eventId]);

  const handleReset = () => {
    setStatusFilter("");
    setSearchTerm("");
  };

  const filteredBookings = eventBookings.filter((b) => {
    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    const matchesSearch = searchTerm
      ? b.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const downloadCSV = () => {
    if (!filteredBookings.length) return;
    const headers = ["No,User,Seats,Amount,Status,Date"];
    const rows = filteredBookings.map((b, index) =>
      [
        index + 1,
        `"${b.userId?.username || "N/A"}"`,
        b.quantity,
        b.totalAmount,
        b.status,
        new Date(b.createdAt).toLocaleString(),
      ].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `bookings_${selectedEvent?.name}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isEventPast =
    selectedEvent && new Date(selectedEvent.datetime) < new Date();

  return (
    <div className="min-h-[90vh] bg-[#020617] text-gray-200 p-4 md:p-8 font-sans">
      <div className="mb-10">
        <h2 className="flex items-center gap-3 text-3xl md:text-4xl font-black text-white">
          <FaListAlt className="text-cyan-500" />
          <span>Event Bookings</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Manage and export attendee data for this event.
        </p>
      </div>

      {selectedEvent && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-bold text-cyan-400">
                  {selectedEvent.name}
                </h3>
                {isEventPast && (
                  <button
                    onClick={() => navigate(`/admin/events/reviews/${eventId}`)}
                    className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-slate-950 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black  transition-all"
                  >
                    <FaStar size={12} /> View Reviews
                  </button>
                )}
              </div>
              <p className="text-slate-400 text-sm">{selectedEvent.location}</p>

              <div className="flex flex-wrap gap-6 mt-4 text-xs">
                <div>
                  <p className="text-slate-500  text-[9px] font-bold tracking-tighter">
                    Organizer
                  </p>
                  <p className="font-bold text-slate-200">
                    {selectedEvent.organizerId?.username}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500  text-[9px] font-bold tracking-tighter">
                    Event Date
                  </p>
                  <p className="text-slate-200">
                    {new Date(selectedEvent.datetime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500  text-[9px] font-bold tracking-tighter">
                    Current Status
                  </p>
                  <p
                    className={`font-bold  ${
                      selectedEvent.status === "active"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {selectedEvent.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="text"
                  placeholder="Search User..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:border-cyan-500 outline-none w-40"
                />
              </div>

              <select
                value={statusFilter}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <button
                  onClick={handleReset}
                  title="Reset Filters"
                  className="bg-slate-800 hover:bg-rose-500/20 hover:text-rose-500 text-slate-400 p-2.5 rounded-lg transition-all"
                >
                  <FaUndo size={12} />
                </button>

                <button
                  onClick={downloadCSV}
                  disabled={!filteredBookings.length}
                  title="Download CSV"
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 p-2.5 rounded-lg transition-all"
                >
                  <FaDownload size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 text-center text-cyan-500 font-black tracking-widest animate-pulse">
            LOADING BOOKINGS...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-20 text-center text-slate-600 font-bold  tracking-widest">
            No matching records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-950 text-slate-500  text-[10px] font-black tracking-widest border-b border-slate-800">
                  <th className="p-5">#</th>
                  <th className="p-5">User Account</th>
                  <th className="p-5 text-center">Seats</th>
                  <th className="p-5 text-center">Revenue</th>
                  <th className="p-5 text-center">Booking Status</th>
                  <th className="p-5">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredBookings.map((b, index) => (
                  <tr
                    key={b._id}
                    className="hover:bg-cyan-500/5 transition-colors group"
                  >
                    <td className="p-5 text-slate-600 font-mono">
                      {index + 1}
                    </td>
                    <td className="p-5">
                      <p className="text-slate-200 font-bold group-hover:text-cyan-400 transition-colors">
                        {b.userId?.username || "Unknown User"}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {b.userId?._id}
                      </p>
                    </td>
                    <td className="p-5 text-center font-mono font-bold text-slate-400">
                      {b.quantity}
                    </td>
                    <td className="p-5 text-center text-emerald-400 font-black font-mono">
                      ₹{b.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black  tracking-widest border ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : b.status === "pending"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 font-mono text-[11px]">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventBookings;
