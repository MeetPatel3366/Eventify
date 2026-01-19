import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  resetBookingState,
  verifyBookingPayment,
} from "../../store/bookingSlice";
import { fetchEvent } from "../../store/eventSlice";
import { loadRazorpay } from "../../utils/loadRazorpay";

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
    return () => {
      dispatch(resetBookingState());
    };
  }, [dispatch]);

  const verifyPayment = async (response, bookingId) => {
    try {
      const res = await dispatch(
        verifyBookingPayment({
          bookingId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        }),
      );

      console.log("Payment Verification Response: ", res);
      if (res.payload.success) {
        navigate("/my-bookings");
      }
    } catch (err) {
      console.error(err);
      alert("Payment verification failed");
    }
  };

  const handleBooking = async () => {
    const result = await dispatch(createBooking({ eventId: id, quantity }));

    console.log("Booking Result: ", result);
    if (!result.payload?.order) {
      alert("Something went wrong.");
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const { order, key, bookingId } = result.payload;
    console.log("Order Details: ", order, key, bookingId);

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Eventify",
      image: "https://cdn-icons-png.flaticon.com/512/1161/1161388.png",
      description: "Event Booking Payment",
      order_id: order.id,
      handler: async function (response) {
        verifyPayment(response, bookingId);
      },
      theme: {
        color: "#6366f1",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (!event) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[87vh] flex items-center justify-center">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="relative h-48 md:h-52">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {event.name}
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-indigo-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-400 shrink-0" />
              <span>
                {new Date(event.datetime).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaTicketAlt className="text-indigo-400 shrink-0" />
              <span
                className={
                  event.availableSeats < 10 ? "text-red-400 font-bold" : ""
                }
              >
                {event.availableSeats} Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaRupeeSign className="text-indigo-400 shrink-0" />
              <span>₹{event.price} / seat</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 italic">
            {event.description}
          </p>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                  Quantity
                </span>
                <div className="flex items-center bg-black/20 rounded-lg px-2 border border-white/5">
                  <input
                    type="number"
                    min="1"
                    max={event.availableSeats}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            Number(e.target.value),
                            event.availableSeats,
                          ),
                        ),
                      )
                    }
                    className="w-12 bg-transparent text-white font-bold text-center py-1 focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                  Payable Amount
                </p>
                <p className="text-2xl font-black text-indigo-400">
                  ₹{event.price * quantity}
                </p>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading || event.availableSeats === 0}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all active:scale-[0.98] font-bold text-white shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Confirming..." : "Book Now"}
            </button>
          </div>

          {(error || success) && (
            <div
              className={`text-sm text-center p-3 rounded-xl border ${
                error
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-green-500/10 border-green-500/20 text-green-400"
              }`}
            >
              {error || (
                <span className="flex items-center justify-center gap-2">
                  <FaCheckCircle className="animate-bounce" /> {success}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventBooking;
