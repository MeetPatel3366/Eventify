import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaClock,
  FaChevronLeft,
  FaMapMarkerAlt,
  FaTag,
  FaUserCheck,
  FaCheckCircle,
} from "react-icons/fa";
import {
  checkInBooking,
  fetchexportBookingsCSV,
  fetchMyEventBookings,
  resetBookingState,
} from "../../store/bookingSlice";

const MyEventBookings = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myEventBookings, event, loading, error } = useSelector(
    (state) => state.booking
  );

  const [filters, setFilters] = useState({
    guest: "",
    checkIn: "all",
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    bookingId: null,
    username: "",
  });

  const eventDate = new Date(event?.datetime);
  const today = new Date();

  const isEventToday =
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear();

  const isPastEvent = eventDate < today && !isEventToday;

  useEffect(() => {
    dispatch(fetchMyEventBookings(eventId));
  }, [dispatch, eventId]);

  const filteredBookings = myEventBookings.filter((b) => {
    const guestMatch =
      b.userId?.username?.toLowerCase().includes(filters.guest.toLowerCase()) ||
      b.userId?.email?.toLowerCase().includes(filters.guest.toLowerCase());

    const checkInMatch =
      filters.checkIn === "all"
        ? true
        : filters.checkIn === "checked"
        ? b.checkedIn === true
        : b.checkedIn === false;

    return guestMatch && checkInMatch;
  });

  const totalSeatsSold = myEventBookings.reduce(
    (acc, b) => acc + (b.quantity || 0),
    0
  );

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm transition-colors"
          >
            <FaChevronLeft size={12} /> Back to Insights
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <button
              onClick={() => dispatch(fetchexportBookingsCSV(eventId))}
              className="w-fit px-4 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-sm font-medium"
            >
              Download CSV
            </button>
          </div>

          {event && (
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="text-indigo-400 font-semibold">
                {event.name}
              </span>
              <span className="flex items-center gap-1.5">
                <FaClock className="text-xs" />{" "}
                {new Date(event.datetime).toLocaleDateString("en-IN")}
              </span>
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-xs" /> {event.location}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <FaTag className="text-xs" />{" "}
                {event.price === 0 ? "Free" : `₹${event.price}`}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">
              Search Guest
            </label>
            <input
              type="text"
              placeholder="Name or email..."
              value={filters.guest}
              onChange={(e) =>
                setFilters({ ...filters, guest: e.target.value })
              }
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-48"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">
              Status Filter
            </label>
            <select
              value={filters.checkIn}
              onChange={(e) =>
                setFilters({ ...filters, checkIn: e.target.value })
              }
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-40"
            >
              <option value="all">All Guests</option>
              <option value="checked">Checked In</option>
              <option value="not_checked">Not Checked In</option>
            </select>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 px-5 py-2.5 rounded-xl flex flex-col justify-center min-w-[120px]">
            <p className="text-[10px] uppercase text-indigo-400 font-bold leading-tight">
              Total Seats
            </p>
            <p className="text-2xl font-black text-white">{totalSeatsSold}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4 text-center">Seats</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check-In</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-20 text-center text-slate-500 italic"
                  >
                    No matching bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, i) => (
                  <tr key={b._id} className="hover:bg-white/[0.03]">
                    <td className="px-6 py-4 text-slate-500">{i + 1}</td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-100">
                        {b.userId?.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        {b.userId?.email}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400">
                        {b.quantity}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold">₹{b.totalAmount}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(b.createdAt).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      {b.checkedIn ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs">
                          <FaCheckCircle /> Arrived
                        </span>
                      ) : isEventToday ? (
                        <button
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              bookingId: b._id,
                              username: b.userId?.username,
                            })
                          }
                          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs"
                        >
                          <FaUserCheck /> Check-In
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Unavailable
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-800 p-6 rounded-xl w-full max-w-sm border border-slate-700">
            <h3 className="text-lg font-bold text-center mb-4">
              Confirm Check-In
            </h3>

            <p className="text-center text-slate-400 mb-6">
              Mark{" "}
              <span className="text-indigo-400 font-bold">
                {confirmModal.username}
              </span>{" "}
              as checked in?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ isOpen: false, bookingId: null })
                }
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  dispatch(checkInBooking(confirmModal.bookingId));
                  setConfirmModal({ isOpen: false, bookingId: null });
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyEventBookings;
