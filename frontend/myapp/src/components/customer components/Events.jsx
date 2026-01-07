import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/eventSlice";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events } = useSelector((state) => state.event);

  const upcomingEvents = events.filter(
    (event) => new Date(event.datetime) >= new Date()
  );

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleBooking = (selectedEvent) => {
    if (selectedEvent.availableSeats > 0) {
      navigate(`/events/${selectedEvent._id}/book`);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8 mt-2">
        Upcoming Events
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {upcomingEvents.map((event) => (
          <div
            key={event._id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-xl hover:shadow-2xl transition"
          >
            <div className="rounded-2xl overflow-hidden mb-4">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-56 object-cover"
              />
            </div>

            {event.category && (
              <span className="text-xs px-3 py-1 bg-indigo-600/80 rounded-full shadow mb-3 inline-block">
                {event.category}
              </span>
            )}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <span className="px-3 py-1 bg-blue-600 rounded-xl shadow text-sm">
                ₹{event.price}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-300 text-sm mb-3">
              <span>
                {new Date(event.datetime).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "numeric",
                })}
              </span>
              <span>{event.location}</span>
            </div>

            <div className="flex items-center justify-between text-sm mb-3 font-medium">
              <span className="text-gray-400">Availability:</span>
              <span
                className={
                  event.availableSeats <= 5 ? "text-red-400" : "text-green-400"
                }
              >
                {event.availableSeats} / {event.totalSeats} seats left
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-5 line-clamp-3">
              {event.description}
            </p>

            <button
              disabled={event.availableSeats === 0}
              className={`w-full py-3 rounded-xl transition shadow-md font-semibold ${
                event.availableSeats === 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={() => handleBooking(event)}
            >
              {event.availableSeats === 0 ? "Sold Out" : "Book Now"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Events;
