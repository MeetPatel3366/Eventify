import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaRupeeSign,
  FaCheckCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createBooking, resetBookingState } from "../../store/bookingSlice";
import { fetchEvent } from "../../store/eventSlice";

const EventBooking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { event } = useSelector((state) => state.event);
  const { loading, error, success } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/my-bookings"), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetBookingState());
    };
  }, [dispatch]);

  const handleBooking = async () => {
    dispatch(createBooking({ eventId: id, quantity }));
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-48 md:h-64 object-cover"
        />

        <div className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{event.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-indigo-400" />
              <span className="truncate">{event.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-indigo-400" />
              <span className="text-sm md:text-base">
                {new Date(event.datetime).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaTicketAlt className="text-indigo-400" />
              <span className={event.availableSeats < 10 ? "text-red-400" : ""}>
                {event.availableSeats} Seats Available
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaRupeeSign className="text-indigo-400" />
              <span>{event.price} per seat</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {event.description}
          </p>

          <hr className="border-white/10" />

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
              <label className="text-sm font-medium text-gray-400 ml-2">
                Seats
              </label>
              <input
                type="number"
                min="1"
                max={event.availableSeats}
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > event.availableSeats) {
                    setQuantity(event.availableSeats);
                  } else if (val < 1) {
                    setQuantity(1);
                  } else {
                    setQuantity(val);
                  }
                }}
                className="w-16 bg-transparent text-white font-bold text-center focus:outline-none"
              />
            </div>

            <div className="text-2xl font-semibold text-indigo-300">
              Total: ₹{event.price * quantity}
            </div>

            <button
              onClick={handleBooking}
              disabled={loading || event.availableSeats === 0 || quantity < 1}
              className="w-full sm:w-auto px-10 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>

          {(error || success) && (
            <div className="mt-4 text-center">
              {error && <p className="text-red-400 animate-pulse">{error}</p>}
              {success && (
                <p className="text-green-400 flex items-center justify-center gap-2">
                  <FaCheckCircle /> {success}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventBooking;
