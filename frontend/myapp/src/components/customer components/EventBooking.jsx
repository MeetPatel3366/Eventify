import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaRupeeSign,
  FaArrowLeft,
  FaPalette,
  FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  resetBookingState,
  verifyBookingPayment,
} from "../../store/bookingSlice";
import { fetchEvent } from "../../store/eventSlice";
import { getMyProfile } from "../../store/authSlice";
import { loadRazorpay } from "../../utils/loadRazorpay";
import toast from "react-hot-toast";

const EventBooking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [themePopup, setThemePopup] = useState(null);

  const { event } = useSelector((state) => state.event);
  const { loading } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvent(id));
    dispatch(getMyProfile());
  }, [id, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetBookingState());
    };
  }, [dispatch]);

  const hasThemes = event?.themes && event.themes.length > 0;
  const needsAddress = !user?.address || !user.address.trim();

  const verifyPayment = async (response, bookingId) => {
    try {
      const res = await dispatch(
        verifyBookingPayment({
          bookingId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        })
      );
      if (res.payload.success) navigate("/my-bookings");
    } catch {
      alert("Payment verification failed");
    }
  };

  const handleBooking = async () => {
    if (needsAddress) {
      toast.error("Please add your address");
      navigate("/my-profile");
      return;
    }

    if (hasThemes && !selectedTheme) {
      toast.error("Select a theme");
      return;
    }

    const bookingData = { eventId: id, quantity };
    if (selectedTheme) bookingData.selectedTheme = selectedTheme;

    const result = await dispatch(createBooking(bookingData));

    if (!result.payload?.order) return;

    const res = await loadRazorpay();
    if (!res) return;

    const { order, key, bookingId } = result.payload;

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Eventify",
      order_id: order.id,
      handler: async function (response) {
        verifyPayment(response, bookingId);
      },
      theme: { color: "#6366f1" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (!event) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full" />
      </div>
    );
  }

  const handleThemeClick = (theme) => {
    setSelectedTheme(theme.name);
    if (theme.images && theme.images.length > 0 && theme.images[0].secure_url) {
      setPreviewImage(theme.images[0].secure_url);
    } else if (theme.images && theme.images.length > 0 && theme.images[0].url) {
      setPreviewImage(theme.images[0].url);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4 overflow-hidden">
      {themePopup && (
        <div
          className="fixed inset-0 bg-black/70 z-[250] flex items-center justify-center p-4"
          onClick={() => setThemePopup(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setThemePopup(null)}
              className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full transition-all"
            >
              <FaTimes size={14} />
            </button>

            {themePopup.images &&
              themePopup.images.length > 0 &&
              themePopup.images[0]?.secure_url ? (
              <img
                src={themePopup.images[0].secure_url}
                alt={themePopup.name}
                className="w-full h-[420px] object-cover"
              />
            ) : themePopup.images &&
              themePopup.images.length > 0 &&
              themePopup.images[0]?.url ? (
              <img
                src={themePopup.images[0].url}
                alt={themePopup.name}
                className="w-full h-[420px] object-cover"
              />
            ) : (
              <div className="w-full h-[420px] flex items-center justify-center bg-slate-800 text-slate-400 text-sm font-semibold">
                No Theme Image Available
              </div>
            )}

            <div className="p-4 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white capitalize">
                {themePopup.name}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl h-[96vh] grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          <div className="relative h-72 md:h-80 bg-black flex items-center justify-center">
            <img
              src={event.image}
              className="w-full h-full object-cover"
              alt={event.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white"
            >
              <FaArrowLeft />
            </button>

            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-bold text-white">
                {event.name}
              </h1>
            </div>
          </div>

          <div className="p-5 space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> {event.location}
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              {new Date(event.datetime).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>

            <p className="text-gray-400 text-xs">
              {event.description}
            </p>
          </div>
        </div>

        <div className="h-full flex flex-col justify-between p-6 md:p-8">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <FaTicketAlt /> {event.availableSeats}
              </span>
              <span className="flex items-center gap-2">
                <FaRupeeSign /> ₹{event.price}
              </span>
            </div>

            {hasThemes && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
                  <FaPalette /> Select Theme
                </div>

                {previewImage && (
                  <img
                    src={previewImage}
                    className="w-full h-44 object-cover rounded-xl border border-white/10"
                    alt="Preview"
                  />
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {event.themes.map((theme, idx) => {
                    const isSelected = selectedTheme === theme.name;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleThemeClick(theme)}
                        className={`cursor-pointer rounded-lg border p-2 ${isSelected
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                          }`}
                      >
                        {theme.images?.[0] && (
                          <img
                            src={theme.images[0].secure_url || theme.images[0].url}
                            className="w-full h-16 object-cover rounded-md mb-1 cursor-pointer hover:scale-105 transition-transform"
                            alt={theme.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              setThemePopup(theme);
                            }}
                          />
                        )}
                        <p className="text-xs text-center cursor-pointer hover:text-purple-300 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThemePopup(theme);
                          }}>
                          {theme.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
              <input
                type="number"
                min="1"
                max={event.availableSeats}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(Number(e.target.value), event.availableSeats)
                    )
                  )
                }
                className="w-16 bg-transparent border border-white/10 rounded text-center text-white"
              />

              <div className="text-right">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-2xl font-bold text-indigo-400">
                  ₹{event.price * quantity}
                </p>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={
                loading ||
                event.availableSeats === 0 ||
                needsAddress ||
                (hasThemes && !selectedTheme)
              }
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : needsAddress
                  ? "Add Address"
                  : hasThemes && !selectedTheme
                    ? "Select Theme"
                    : "Book Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBooking;