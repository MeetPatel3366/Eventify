import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaChartLine,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { fetchprogressEvent } from "../../store/eventSlice";

const EventProgress = () => {
  const dispatch = useDispatch();
  const { progressEvent } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchprogressEvent());
  }, [dispatch]);

  if (!progressEvent || progressEvent.length === 0) {
    return (
      <div className="text-center space-y-4">
        <FaChartLine className="text-6xl text-gray-700 mx-auto" />
        <h2 className="text-2xl font-bold">No Approved Events Tracked</h2>
        <p className="text-gray-400">
          Approved events will appear here once scheduled.
        </p>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Planned":
        return {
          color: "text-orange-400",
          bg: "bg-orange-500",
          icon: <FaHourglassHalf />,
        };
      case "Ongoing":
        return {
          color: "text-blue-400",
          bg: "bg-blue-500",
          icon: <FaCalendarCheck className="animate-bounce" />,
        };
      case "Completed":
        return {
          color: "text-green-400",
          bg: "bg-green-500",
          icon: <FaCheckCircle />,
        };
      default:
        return { color: "text-gray-400", bg: "bg-gray-500", icon: null };
    }
  };

  return (
    <>
      <header className="mb-12 text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
          Event <span className="text-indigo-500">Progress</span> Tracker
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {progressEvent.map((event) => {
          const config = getStatusConfig(event.progressStatus);

          return (
            <div
              key={event._id}
              className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black bg-black/60 backdrop-blur-md border border-white/10 ${config.color}`}
                >
                  {config.icon} {event.progressStatus.toUpperCase()}
                </span>
              </div>

              <div className="h-44 w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <h2 className="text-lg font-bold mb-3 line-clamp-1">
                  {event.name}
                </h2>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300 text-xs gap-2">
                    <FaCalendarAlt className="text-indigo-400 shrink-0" />
                    <span>
                      {new Date(event.datetime).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-xs gap-2">
                    <FaMapMarkerAlt className="text-indigo-400 shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                <div className="mb-6 flex-grow">
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 italic">
                    {event.description ||
                      "No specific details provided for this event."}
                  </p>
                </div>

                <div className="mt-auto space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      Preparation
                    </span>
                    <span className={`text-base font-black ${config.color}`}>
                      {event.progressPercentage}%
                    </span>
                  </div>

                  <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                    {event.progressStatus === "Ongoing" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    )}

                    <div
                      className={`h-full rounded-full ${config.bg} transition-transform duration-1000 ease-in-out`}
                      style={{ width: `${event.progressPercentage}%` }}
                    />
                  </div>

                  <p className="text-[9px] text-gray-500 uppercase tracking-tighter text-right font-semibold">
                    {event.progressStatus === "Planned" && "Incoming Event"}
                    {event.progressStatus === "Ongoing" && "Happening Now"}
                    {event.progressStatus === "Completed" && "Event Finished"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EventProgress;
