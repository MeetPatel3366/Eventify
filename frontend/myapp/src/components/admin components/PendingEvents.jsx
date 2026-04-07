import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaEnvelope,
  FaRupeeSign,
  FaPalette,
} from "react-icons/fa";
import { MdPinDrop } from "react-icons/md";
import {
  approveEvent,
  fetchPendingEvents,
  rejectEvent,
} from "../../store/adminSlice";

const PendingEvents = () => {
  const dispatch = useDispatch();
  const { pendingEvents, loading } = useSelector((state) => state.admin);
  const [rejectingId, setRejectingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [previewImages, setPreviewImages] = useState({});

  useEffect(() => {
    dispatch(fetchPendingEvents());
  }, [dispatch]);

  if (loading) {
    return <p className="text-gray-400 text-center">Loading requests...</p>;
  }

  return (
    <>
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-wide">
        Pending Events
      </h1>

      {pendingEvents.length === 0 ? (
        <p className="text-gray-400 text-center">No pending events</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          {pendingEvents.map((event) => {
            const preview = previewImages[event._id] || event.image;

            return (
              <div
                key={event._id}
                className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >
                <div className="relative h-48 bg-black flex items-center justify-center">
                  <img
                    src={preview}
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {event.name}
                  </h2>

                  <div className="mt-3 bg-gray-50 border rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-800">
                      <FaUserTie /> {event.organizerId?.username}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaEnvelope /> {event.organizerId?.email}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <span className="flex gap-2">
                      <FaMapMarkerAlt /> {event.location}
                    </span>
                    <span className="flex gap-2">
                      <FaCalendarAlt />
                      {new Date(event.datetime).toLocaleDateString()}
                    </span>
                    <span className="flex gap-2">
                      <FaClock />
                      {new Date(event.datetime).toLocaleTimeString()}
                    </span>
                    <span className="flex gap-2 font-semibold text-indigo-600">
                      <FaRupeeSign /> {event.price}
                    </span>
                    {event.pincode && (
                      <span className="flex gap-2">
                        <MdPinDrop /> {event.pincode}
                      </span>
                    )}
                  </div>

                  {event.themes?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1">
                        <FaPalette /> Themes
                      </p>

                      <div className="flex gap-2 overflow-x-auto">

                        <img
                          src={event.image}
                          onClick={() =>
                            setPreviewImages((prev) => ({
                              ...prev,
                              [event._id]: event.image,
                            }))
                          }
                          className={`w-12 h-12 object-cover rounded-lg border cursor-pointer ${
                            preview === event.image
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                        />

                        {event.themes.flatMap((t) =>
                          t.images?.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.secure_url}
                              onClick={() =>
                                setPreviewImages((prev) => ({
                                  ...prev,
                                  [event._id]: img.secure_url,
                                }))
                              }
                              className={`w-12 h-12 object-cover rounded-lg border cursor-pointer ${
                                preview === img.secure_url
                                  ? "border-purple-500"
                                  : "border-gray-200"
                              }`}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-5 border-t flex gap-3 mt-5">
                    <button
                      onClick={async () => {
                        try {
                          await dispatch(approveEvent(event._id)).unwrap();
                          toast.success("Approved");
                        } catch {
                          toast.error("Error");
                        }
                      }}
                      className="flex-1 py-2 rounded-xl bg-green-500 text-white"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => setRejectingId(event._id)}
                      className="flex-1 py-2 rounded-xl bg-red-500 text-white"
                    >
                      Reject
                    </button>
                  </div>

                  {rejectingId === event._id && (
                    <div className="mt-3">
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={async () => {
                            await dispatch(
                              rejectEvent({ id: event._id, feedback })
                            );
                            setRejectingId(null);
                            setFeedback("");
                          }}
                          className="flex-1 bg-red-600 text-white py-2 rounded"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setRejectingId(null)}
                          className="flex-1 bg-gray-300 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default PendingEvents;