import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaChartLine,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

import { fetchprogressEvent } from "../../store/eventSlice";
import {
  getEventRatingSummary,
  getEventReviews,
} from "../../store/reviewSlice";

const EventProgress = () => {
  const dispatch = useDispatch();
  const { progressEvent } = useSelector((state) => state.event);
  const { summary, reviews } = useSelector((state) => state.review);

  const [showModal, setShowModal] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    dispatch(fetchprogressEvent());
  }, [dispatch]);

  useEffect(() => {
    if (progressEvent?.length > 0) {
      progressEvent.forEach((event) => {
        if (event.progressStatus === "Completed") {
          dispatch(getEventRatingSummary(event._id));
        }
      });
    }
  }, [progressEvent, dispatch]);

  const handleViewReviews = async (event) => {
    setSelectedEventName(event.name);
    setShowModal(true);
    setLoadingReviews(true);
    await dispatch(getEventReviews(event._id));
    setLoadingReviews(false);
  };

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

  if (!progressEvent || progressEvent.length === 0) {
    return (
      <div className="text-center space-y-4 py-20 text-white">
        <FaChartLine className="text-6xl text-gray-700 mx-auto" />
        <h2 className="text-2xl font-bold">No Approved Events Tracked</h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 md:p-8 text-white">
      <header className="mb-12 text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
          Event <span className="text-indigo-500">Progress</span> Tracker
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {progressEvent.map((event) => {
          const config = getStatusConfig(event.progressStatus);
          const rating = summary?.[event._id];

          return (
            <div
              key={event._id}
              className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl transition-transform hover:scale-[1.02]"
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
                    <FaCalendarAlt className="text-indigo-400" />
                    <span>{new Date(event.datetime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-xs gap-2">
                    <FaMapMarkerAlt className="text-indigo-400" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                {event.isCompleted && rating && (
                  <div className="mb-4 bg-black/20 p-3 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <FaStar className="text-lg" />
                        <span className="font-bold text-sm">
                          {rating.avg ?? 0} / 5
                        </span>
                      </div>
                      <span className="text-gray-400 text-[10px]">
                        {rating.count} reviews
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewReviews(event)}
                      className="w-full py-2 text-[10px] font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition-all"
                    >
                      VIEW ALL REVIEWS
                    </button>
                  </div>
                )}

                <div className="mt-auto space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      Status
                    </span>
                    <span className={`text-base font-black ${config.color}`}>
                      {event.progressPercentage}%
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${config.bg} transition-all duration-1000`}
                      style={{ width: `${event.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-xl font-bold text-white">Guest Reviews</h3>
                <p className="text-xs text-gray-400 truncate w-64">
                  {selectedEventName}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {loadingReviews ? (
                <div className="text-center py-10 text-gray-400">
                  Loading reviews...
                </div>
              ) : reviews && reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="border-b border-white/5 pb-4 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <FaUserCircle className="text-2xl text-gray-600" />
                        <div>
                          <p className="text-sm font-bold text-white">
                            {rev.userId?.username || "Guest User"}
                          </p>
                          <div className="flex text-yellow-400 text-[10px]">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < rev.rating
                                    ? "fill-current"
                                    : "text-gray-700"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      "{rev.review}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    No reviews found for this event.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventProgress;
