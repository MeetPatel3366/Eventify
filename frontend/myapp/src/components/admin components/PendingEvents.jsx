import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";


import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaEnvelope,
  FaRupeeSign,
} from "react-icons/fa";
import { approveEvent, rejectEvent } from "../../store/adminSlice";

const PendingEvents = () => {
  const dispatch = useDispatch();
  const { pendingEvents } = useSelector((state) => state.admin);
  const [rejectingId, setRejectingId] = useState(null);
  const [feedback, setFeedback] = useState("");

  return (
    <>
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-wide">
        Pending Events
      </h1>

      {pendingEvents.length === 0 ? (
        <p className="text-gray-400 text-center">No pending events</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          {pendingEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-3xl border border-gray-200 shadow-md 
            hover:shadow-xl transition overflow-hidden 
         flex flex-col"
            >
              <div className="relative h-44 shrink-0">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <span
                  className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full 
                    bg-yellow-100 text-yellow-700"
                >
                  Pending
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {event.name}
                  </h2>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {event.category.name}
                  </p>
                </div>

                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <FaUserTie className="text-indigo-500" />
                    {event.organizerId?.username}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <FaEnvelope />
                    {event.organizerId?.email}
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-rose-500 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500 shrink-0" />
                    <span>{new Date(event.datetime).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaClock className="text-emerald-500 shrink-0" />
                    <span>
                      {new Date(event.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-semibold text-indigo-600">
                    <FaRupeeSign className="shrink-0" />
                    <span>{event.price}</span>
                  </div>
                </div>

                <div className=" pt-5 border-t flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        await dispatch(approveEvent(event._id)).unwrap();
                        toast.success("Event approved successfully");
                      } catch (err) {
                        toast.error("Failed to approve event");
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 
                     text-white text-sm font-semibold transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => setRejectingId(event._id)}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 
     text-white text-sm font-semibold transition"
                  >
                    Reject
                  </button>
                </div>

                {rejectingId === event._id && (
                  <div className="mt-4">
                    <textarea
                      rows="3"
                      placeholder="Write rejection feedback..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full p-3 text-sm rounded-xl border 
         focus:ring-2 focus:ring-rose-400 
         text-gray-900"
                    />

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={async () => {
                          try {
                            await dispatch(
                              rejectEvent({
                                id: event._id,
                                feedback,
                              }),
                            ).unwrap();

                            toast.success("Event rejected and feedback sent");

                            setRejectingId(null);
                            setFeedback("");
                          } catch (err) {
                            toast.error(
                              err?.message || "Failed to reject event",
                            );
                          }
                        }}
                        className="flex-1 py-2 rounded-xl bg-rose-600 
           text-white text-sm font-semibold"
                      >
                        Submit
                      </button>

                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setFeedback("");
                        }}
                        className="flex-1 py-2 rounded-xl bg-gray-300 
           text-gray-800 text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PendingEvents;
