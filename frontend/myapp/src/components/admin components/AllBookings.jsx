import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookings } from "../../store/bookingSlice";
import { FaClipboardList } from "react-icons/fa";

const AllBookings = () => {
  const dispatch = useDispatch();
  const { allBookings, loading } = useSelector((state) => state.booking);

  const [filters, setFilters] = useState({
    eventname: "",
    organizername: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(fetchAllBookings(filters));
  }, [filters, dispatch]);

  return (
    <div className="min-h-[calc(97vh-64px)] bg-[#0B0F19] text-gray-200 p-6">
      <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 text-white">
        <FaClipboardList className="text-indigo-400" />
        <span>All Bookings</span>
      </h2>

      <div className="bg-[#111827] rounded-xl p-5 mb-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-300">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Event name"
            className="bg-[#0B0F19] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) =>
              setFilters({ ...filters, eventname: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Organizer name"
            className="bg-[#0B0F19] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) =>
              setFilters({ ...filters, organizername: e.target.value })
            }
          />

          <select
            className="bg-[#0B0F19] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            className="bg-[#0B0F19] border border-gray-700 rounded-lg px-3 py-2 text-white"
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />

          <input
            type="date"
            className="bg-[#0B0F19] border border-gray-700 rounded-lg px-3 py-2 text-white"
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="bg-[#111827] rounded-xl shadow-lg overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-400">
            Loading bookings...
          </div>
        ) : allBookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No bookings found</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#020617] text-gray-300 uppercase text-xs">
                <th className="p-3 text-left">No.</th>
                <th className="p-3 text-left">Event</th>
                <th className="p-3 text-left">Organizer</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-center">Seats</th>
                <th className="p-3 text-center">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-left">Booked On</th>
              </tr>
            </thead>

            <tbody>
              {allBookings.map((b, index) => (
                <tr
                  key={b._id}
                  className="border-b border-gray-800 hover:bg-[#0B0F19] transition"
                >
                  <td className="p-3 ">{index + 1}</td>

                  <td className="p-3 font-medium text-white">
                    {b.eventId?.name}
                  </td>

                  <td className="p-3">{b.eventId?.organizerId?.username}</td>

                  <td className="p-3">{b.userId?.username}</td>

                  <td className="p-3 text-center">{b.quantity}</td>

                  <td className="p-3 text-center font-semibold">
                    ₹{b.totalAmount}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          b.status === "confirmed"
                            ? "bg-green-900/40 text-green-400"
                            : b.status === "pending"
                            ? "bg-yellow-900/40 text-yellow-400"
                            : "bg-red-900/40 text-red-400"
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-400">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllBookings;
