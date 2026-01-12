import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookings } from "../../store/bookingSlice";
import { FaClipboardList, FaDownload, FaUndo } from "react-icons/fa";

const AllBookings = () => {
  const dispatch = useDispatch();
  const { allBookings, loading } = useSelector((state) => state.booking);

  const initialFilters = {
    eventname: "",
    organizername: "",
    status: "",
    startDate: "",
    endDate: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    dispatch(fetchAllBookings(filters));
  }, [filters, dispatch]);

  const handleReset = () => {
    setFilters(initialFilters);
  };

  const downloadCSV = () => {
    if (allBookings.length === 0) return;
    const headers = ["No,Event,Organizer,User,Seats,Amount,Status,Date"];
    const rows = allBookings.map((b, index) =>
      [
        index + 1,
        `"${b.eventId?.name || "N/A"}"`,
        `"${b.eventId?.organizerId?.username || "N/A"}"`,
        `"${b.userId?.username || "N/A"}"`,
        b.quantity,
        b.totalAmount,
        b.status,
        new Date(b.createdAt).toLocaleDateString(),
      ].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 p-4 md:p-8 font-sans">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
        <div className="flex-shrink-0">
          <h2 className="flex items-center gap-3 text-3xl md:text-4xl font-black text-white tracking-tighter">
            <FaClipboardList className="text-cyan-500" />
            <span>All Bookings</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Global transaction history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-3 md:p-4 rounded-3xl border border-slate-800 backdrop-blur-md w-full xl:w-auto">
          <input
            type="text"
            placeholder="Event..."
            value={filters.eventname}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none flex-1 min-w-[120px]"
            onChange={(e) =>
              setFilters({ ...filters, eventname: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Organizer..."
            value={filters.organizername}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none flex-1 min-w-[120px]"
            onChange={(e) =>
              setFilters({ ...filters, organizername: e.target.value })
            }
          />

          <select
            value={filters.status}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none flex-1 min-w-[100px]"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <input
              type="date"
              value={filters.startDate}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-[10px] text-white outline-none invert-[0.8] w-full"
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <input
              type="date"
              value={filters.endDate}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-[10px] text-white outline-none invert-[0.8] w-full"
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2 ml-auto sm:border-l sm:border-slate-800 sm:pl-3">
            <button
              onClick={handleReset}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition-all active:scale-95"
              title="Reset Filters"
            >
              <FaUndo size={14} />
            </button>
            <button
              onClick={downloadCSV}
              disabled={allBookings.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
              title="Export CSV"
            >
              <FaDownload size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-500 font-black uppercase tracking-widest animate-pulse">
            Syncing Ledger...
          </div>
        ) : allBookings.length === 0 ? (
          <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest">
            No entries found
          </div>
        ) : (
          <div className="w-full overflow-x-auto scrollbar-hide md:scrollbar-default">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-800">
                  <th className="p-4 md:p-6 text-left whitespace-nowrap">
                    No.
                  </th>
                  <th className="p-4 md:p-6 text-left whitespace-nowrap">
                    Event
                  </th>
                  <th className="p-4 md:p-6 text-left whitespace-nowrap">
                    Organizer
                  </th>
                  <th className="p-4 md:p-6 text-left whitespace-nowrap">
                    User
                  </th>
                  <th className="p-4 md:p-6 text-center whitespace-nowrap">
                    Seats
                  </th>
                  <th className="p-4 md:p-6 text-center whitespace-nowrap">
                    Amount
                  </th>
                  <th className="p-4 md:p-6 text-center whitespace-nowrap">
                    Status
                  </th>
                  <th className="p-4 md:p-6 text-left whitespace-nowrap">
                    Booked On
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/50">
                {allBookings.map((b, index) => (
                  <tr
                    key={b._id}
                    className="hover:bg-cyan-500/5 transition-colors group"
                  >
                    <td className="p-4 md:p-6 text-slate-600 font-mono">
                      {index + 1}
                    </td>
                    <td className="p-4 md:p-6 font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {b.eventId?.name}
                    </td>
                    <td className="p-4 md:p-6 text-slate-400 whitespace-nowrap">
                      {b.eventId?.organizerId?.username}
                    </td>
                    <td className="p-4 md:p-6 text-slate-400 whitespace-nowrap">
                      {b.userId?.username}
                    </td>
                    <td className="p-4 md:p-6 text-center font-bold font-mono">
                      {b.quantity}
                    </td>
                    <td className="p-4 md:p-6 text-center font-black text-emerald-400 font-mono text-lg whitespace-nowrap">
                      ₹{b.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-4 md:p-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block whitespace-nowrap ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : b.status === "pending"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-slate-500 font-mono text-xs whitespace-nowrap">
                      {new Date(b.createdAt).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
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

export default AllBookings;
