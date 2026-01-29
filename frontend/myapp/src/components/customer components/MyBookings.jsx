import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaStar,
  FaEdit,
  FaTimes,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { cancelBooking, fetchMyBookings } from "../../store/bookingSlice";
import {
  getEventRatingSummary,
  createReview,
  deleteReview,
  updateReview,
} from "../../store/reviewSlice";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);
  const { summary } = useSelector((state) => state.review);

  const [searchTerm, setSearchTerm] = useState("");
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    isEdit: false,
    eventId: null,
    rating: 5,
    comment: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
  });

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (bookings?.length > 0) {
      bookings.forEach((booking) => {
        if (booking.eventId?._id) {
          dispatch(getEventRatingSummary(booking.eventId._id));
        }
      });
    }
  }, [bookings, dispatch]);

  const filteredBookings = bookings.filter((booking) => {
    const eventName = booking.eventId?.name || "";
    return eventName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenReviewModal = (event, existingReview = null) => {
    setReviewModal({
      isOpen: true,
      isEdit: !!existingReview,
      eventId: event._id,
      rating: existingReview?.rating || 5,
      comment: existingReview?.review || "",
    });
  };

  const isReview = reviewModal.comment.trim().length > 0;

  const handleSubmitReview = async () => {
    const data = {
      eventId: reviewModal.eventId,
      rating: reviewModal.rating,
      review: reviewModal.comment,
    };

    if (reviewModal.isEdit) {
      await dispatch(updateReview(data));
    } else {
      await dispatch(createReview(data));
    }

    setReviewModal({ ...reviewModal, isOpen: false });
    dispatch(fetchMyBookings());
    dispatch(getEventRatingSummary(reviewModal.eventId));
  };

  const confirmDelete = async () => {
    if (deleteModal.eventId) {
      await dispatch(deleteReview(deleteModal.eventId));
      dispatch(fetchMyBookings());
      dispatch(getEventRatingSummary(deleteModal.eventId));
      setDeleteModal({ isOpen: false, eventId: null });
    }
  };

  const canCancelBooking = (eventDateTime, bookingStatus) => {
    const eventTime = new Date(eventDateTime).getTime();
    const currentTime = Date.now();

    const timeDifference = eventTime - currentTime;
    const hoursLeft = timeDifference / (1000 * 60 * 60);

    return bookingStatus === "confirmed" && hoursLeft >= 24;
  };

  const handleCancel = async (bookingId) => {
    try {
      await dispatch(cancelBooking(bookingId));
      alert("Booking cancelled successfully. Refund initiated!");
      dispatch(fetchMyBookings());
    } catch (error) {
      alert("Cancellation failed.");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">
        My Bookings
      </h1>

      <div className="max-w-md mx-auto mb-10 relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by event name..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBookings.map((booking) => {
          const event = booking.eventId;
          const ratingSummary = summary?.[event?._id];
          const isCompleted = event?.isCompleted || false;

          return (
            <div
              key={booking._id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col"
            >
              <img
                src={event?.image}
                alt={event?.name}
                className="w-full h-44 object-cover"
              />

              <div className="p-4 space-y-3 flex-grow">
                <h2 className="text-xl font-semibold line-clamp-1 text-white">
                  {event?.name}
                </h2>

                {booking.eventId.isCompleted && ratingSummary && (
                  <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <FaStar /> <span>{ratingSummary.avg ?? 0}</span>
                    </div>
                    <span className="text-gray-500 text-[10px]">
                      {ratingSummary.count} reviews
                    </span>
                  </div>
                )}

                <div className="space-y-1 text-gray-400 text-xs">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-400" />{" "}
                    {event?.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-400" />{" "}
                    {new Date(event?.datetime).toLocaleDateString()}
                  </div>
                </div>

                <div className="pt-3 mt-auto border-t border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-indigo-300 font-bold flex items-center">
                      <FaRupeeSign />
                      {booking.totalAmount}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        booking.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {canCancelBooking(event?.datetime, booking.status) && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-2 rounded-lg transition"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {isCompleted && (
                    <div className="flex flex-col gap-2">
                      {!booking.hasReviewed ? (
                        <button
                          onClick={() => handleOpenReviewModal(event)}
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-bold py-2 rounded-lg transition"
                        >
                          Leave a Review
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleOpenReviewModal(event, booking.userReview)
                            }
                            className="flex-grow bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-2 rounded-lg transition flex items-center justify-center gap-2 border border-white/10"
                          >
                            <FaEdit className="text-indigo-400" /> Edit Review
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                eventId: event._id,
                              })
                            }
                            className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/10 transition"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <FaTimes size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">
              {reviewModal.isEdit ? "Update Review" : "Rate Your Experience"}
            </h3>
            <p className="text-gray-400 text-xs mb-6">
              How was the event? Your feedback helps the community.
            </p>

            <div className="space-y-6">
              <div className="flex justify-center gap-4 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setReviewModal({ ...reviewModal, rating: star })
                    }
                    className={`text-4xl transition-all duration-200 ${
                      star <= reviewModal.rating
                        ? "text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                        : "text-gray-700 hover:text-gray-500"
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>

              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                placeholder="Write your review here..."
                value={reviewModal.comment}
                onChange={(e) =>
                  setReviewModal({ ...reviewModal, comment: e.target.value })
                }
              />

              <button
                onClick={handleSubmitReview}
                disabled={!isReview}
                className={`w-full py-4 rounded-2xl font-bold transition shadow-lg active:scale-95
                          ${
                            isReview
                              ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/30"
                              : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
                          }`}
              >
                {reviewModal.isEdit ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <FaTrash size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Delete Review?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Are you sure you want to remove your feedback?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, eventId: null })}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
