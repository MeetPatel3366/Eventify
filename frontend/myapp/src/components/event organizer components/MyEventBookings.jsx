import { useEffect } from "react";
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
  fetchMyEventBookings,
  resetBookingState,
} from "../../store/bookingSlice";
import { useState } from "react";

const MyEventBookings = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myEventBookings, event, loading, error } = useSelector(
    (state) => state.booking
  );
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    bookingId: null,
    username: "",
  });

  const eventDate = new Date(event?.datetime);
  const today = new Date();

  const isEventToday =
    eventDate.getDate() == today.getDate() &&
    eventDate.getMonth() == today.getMonth() &&
    eventDate.getFullYear() == today.getFullYear();

  const isPastEvent = eventDate < today && !isEventToday;

  useEffect(() => {
    dispatch(fetchMyEventBookings(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    return () => {
      dispatch(resetBookingState());
    };
  }, [dispatch]);

  const totalSeatsSold = myEventBookings.reduce(
    (acc, booking) => acc + (booking.quantity || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 mt-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors text-sm"
          >
            <FaChevronLeft size={12} /> Back to Insights
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>

          {event && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400 font-medium">
              <span className="text-indigo-400 font-bold">{event.name}</span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1">
                <FaClock className="text-xs" />
                {new Date(event.datetime).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-xs" /> {event.location}
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <FaTag className="text-xs" />
                {event.price === 0 ? "Free" : `₹${Number(event.price)}`}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hidden lg:block">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            Total Seats Sold
          </p>
          <p className="text-xl font-black">{totalSeatsSold}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Sr No.</th>
                <th className="px-6 py-4">Guest Information</th>
                <th className="px-6 py-4 text-center">Seats</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Transaction Date</th>
                <th className="px-6 py-4">Check-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {myEventBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-slate-500 italic"
                  >
                    No bookings have been recorded for this event yet.
                  </td>
                </tr>
              ) : (
                myEventBookings.map((b, index) => (
                  <tr
                    key={b._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-500 font-mono">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-100 font-bold flex items-center gap-2">
                          {b.userId?.username}
                        </span>
                        <span className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          {b.userId?.email}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg font-bold border border-indigo-500/20">
                        {b.quantity}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-100">
                      ₹{b.totalAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase w-fit ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            b.status === "confirmed"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-amber-500"
                          }`}
                        ></div>
                        {b.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-xs">
                      <div className="flex flex-col">
                        <span>
                          {new Date(b.createdAt).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </span>
                        <span className="opacity-50 tracking-tighter uppercase">
                          {new Date(b.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {b.checkedIn ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold uppercase border border-emerald-500/20">
                          <FaCheckCircle /> Arrived
                        </span>
                      ) : isEventToday ? (
                        <button
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              bookingId: b._id,
                              username: b.userId?.username || "Guest",
                            })
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold transition-all hover:scale-105"
                        >
                          <FaUserCheck /> MARK CHECK-IN
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px] font-medium">
                          {isPastEvent ? "Event Ended" : "Check-in Unavailable"}
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

      {myEventBookings.length > 0 && (
        <div className="mt-6 flex justify-end">
          <p className="text-slate-500 text-xs font-medium">
            Showing {myEventBookings.length} records
          </p>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl scale-in-center">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FaUserCheck size={24} />
            </div>

            <h3 className="text-xl font-bold text-center mb-2">
              Confirm Check-In
            </h3>

            <p className="text-slate-400 text-center text-sm mb-6">
              Are you sure you want to mark{" "}
              <span className="text-indigo-400 font-bold underline decoration-indigo-500/30 underline-offset-4">
                {confirmModal.username}
              </span>{" "}
              as checked in?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setConfirmModal({
                    isOpen: false,
                    bookingId: null,
                    username: "",
                  })
                }
                className="flex-1 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors font-semibold text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(checkInBooking(confirmModal.bookingId));
                  setConfirmModal({
                    isOpen: false,
                    bookingId: null,
                    username: "",
                  });
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors font-semibold text-sm shadow-lg shadow-indigo-500/20 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventBookings;
