import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/eventSlice";

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (loading) return <p className="text-center text-white py-10">Loading events...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 px-6 py-16 text-white">
      <h1 className="text-4xl font-bold text-center mb-12">Upcoming Events</h1>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-xl hover:shadow-2xl transition"
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
                {new Date(event.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span>{event.location}</span>
            </div>
            <p className="text-gray-300 text-sm mb-5 line-clamp-3">
              {event.description}
            </p>

            <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-md font-semibold">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
