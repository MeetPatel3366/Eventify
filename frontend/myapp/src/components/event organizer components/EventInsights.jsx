import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUsers,
  FaTicketAlt,
} from "react-icons/fa";
import { fetchMyEventsWithStats } from "../../store/eventSlice";
import { NavLink } from "react-router-dom";

const EventInsights = () => {
  const dispatch = useDispatch();
  const { myEventStats } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchMyEventsWithStats());
  }, [dispatch]);

  return (
    <>
    <section className="max-w-7xl mx-auto mb-6 mt-4">
        <h1 className="text-5xl font-extrabold mb-3">Event Insights</h1>
        <p className="text-gray-300 text-lg">
          Track sales, attendance, and revenue for your active events.
        </p>
      </section>

      {myEventStats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700">
          <p className="text-slate-500 text-lg">No active event data found.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {myEventStats.map((event) => (
            <NavLink to={`/organizer/events/${event._id}/bookings`}>
              <div
              key={event._id}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col hover:border-slate-500 transition-colors shadow-sm"
            >
              <div className="relative h-40">
                <img
                  src={`http://localhost:4000/uploads/${event.image}`}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {event.category}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold truncate text-white mb-1">
                  {event.name}
                </h2>

                <div className="flex flex-col gap-2 mb-5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <FaCalendarAlt className="shrink-0" />
                    <span>
                      {new Date(event.datetime).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <FaMapMarkerAlt className="shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5 border-t border-slate-700 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Price
                    </span>
                    <span className="text-sm font-medium">₹{event.price}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Tickets Sold
                    </span>
                    <span className="text-sm font-medium">
                      {event.bookedSeats} / {event.totalSeats}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-[11px] font-medium uppercase text-slate-400">
                    <span>Occupancy</span>
                    <span className="text-indigo-400">
                      {Math.round((event.bookedSeats / event.totalSeats) * 100)}
                      %
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${
                          (event.bookedSeats / event.totalSeats) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-auto bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      Net Revenue
                    </span>
                    <span className="text-lg font-bold text-emerald-400 flex items-center">
                      <FaRupeeSign className="text-xs mr-1" />
                      {event.totalRevenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2 rounded-md shadow-sm border border-slate-700">
                    <FaUsers className="text-slate-400 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default EventInsights;
