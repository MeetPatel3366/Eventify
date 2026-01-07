import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaRupeeSign,
  FaClock,
} from "react-icons/fa";
import { fetchMyBookings } from "../../store/bookingSlice";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading your bookings...
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center text-white p-6">
        <div className="text-center">
          <FaTicketAlt className="text-5xl text-gray-600 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold">No bookings found</h2>
          <p className="text-gray-400">You haven't booked any events yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 pb-20 pt-16">
      <h1 className="text-3xl font-bold mb-8 text-center">My Bookings</h1>
      <div
        className="
        grid grid-cols-1 
        sm:grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-6
      "
      >
        {bookings.map((booking) => {
          const event = booking.eventId;

          return (
            <div
              key={booking._id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:scale-[1.02] transition"
            >
              <img
                src={event?.image}
                alt={event?.name}
                className="w-full h-44 object-cover"
              />

              <div className="p-4 space-y-3">
                <h2 className="text-xl font-semibold line-clamp-1">
                  {event?.name}
                </h2>

                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaMapMarkerAlt className="text-indigo-400" />
                  {event?.location}
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCalendarAlt className="text-indigo-400" />
                  Event:{" "}
                  {new Date(event?.datetime).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FaClock className="text-emerald-400" />
                  Booked on:{" "}
                  {new Date(booking.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaTicketAlt className="text-indigo-400" />
                  Seats: {booking.quantity}
                </div>

                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <FaRupeeSign />
                  {booking.totalAmount}
                </div>

                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                    booking.status === "confirmed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
