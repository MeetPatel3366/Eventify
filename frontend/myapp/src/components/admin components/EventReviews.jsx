import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventReviews,
  getEventRatingSummary,
} from "../../store/reviewSlice";
import {
  FaChevronLeft,
  FaStar,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

const EventReviews = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { reviews, summary, loading } = useSelector((state) => state.review);
  const { selectedEvent } = useSelector((state) => state.admin);

  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(getEventReviews(eventId));
    dispatch(getEventRatingSummary(eventId));
  }, [dispatch, eventId]);

  const stats = summary[eventId];

  const filteredReviews = reviews
    .filter(
      (r) => filterRating === "all" || r.rating === parseInt(filterRating)
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "highest") return b.rating - a.rating;
      return a.rating - b.rating;
    });

  const getSentimentColor = (rating) => {
    if (rating >= 4)
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (rating === 3)
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-rose-400 bg-rose-400/10 border-rose-400/20";
  };

  return (
    <div className="min-h-[90vh] bg-[#020617] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(`/admin/events/${eventId}/bookings`)}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 mb-6 text-xs font-bold tracking-widest transition-all group"
        >
          <FaChevronLeft
            size={10}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Bookings
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">
              Event Reviews
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-slate-500 text-sm font-medium">
                Feedback analysis for
              </p>
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-xs font-black uppercase tracking-widest">
                {selectedEvent?.name || "Loading Event..."}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-cyan-500/50 transition-colors">
              <FaFilter className="text-cyan-500 text-[10px]" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="bg-transparent text-slate-300 text-xs font-bold outline-none cursor-pointer [color-scheme:dark]"
              >
                <option value="all" className="bg-[#0f172a] text-white">
                  All Ratings
                </option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n} className="bg-[#0f172a] text-white">
                    {n} Stars
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-cyan-500/50 transition-colors">
              <FaSortAmountDown className="text-cyan-500 text-[10px]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-300 text-xs font-bold outline-none cursor-pointer [color-scheme:dark]"
              >
                <option value="newest" className="bg-[#0f172a] text-white">
                  Newest First
                </option>
                <option value="highest" className="bg-[#0f172a] text-white">
                  Highest Rated
                </option>
                <option value="lowest" className="bg-[#0f172a] text-white">
                  Lowest Rated
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 sticky top-8">
            {stats ? (
              <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                <h2 className="text-slate-400 font-black text-xs tracking-[0.2em] mb-6 uppercase">
                  Performance Summary
                </h2>
                <div className="flex items-center gap-6 mb-10">
                  <div className="text-6xl font-black text-white leading-none">
                    {stats.avg}
                  </div>
                  <div>
                    <div className="flex text-yellow-500 gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={16}
                          className={
                            i < Math.round(stats.avg)
                              ? "fill-current"
                              : "text-slate-800"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-slate-300 text-[10px] font-black tracking-widest uppercase">
                      Based on {stats.count} responses
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.breakdown?.[star] || 0;
                    const progress =
                      stats.count > 0 ? (count / stats.count) * 100 : 0;
                    return (
                      <div key={star} className="group">
                        <div className="flex justify-between text-[12px] font-black mb-1.5 tracking-tighter">
                          <span className="text-slate-500">{star} Stars</span>
                          <span className="text-slate-300 group-hover:text-cyan-400 transition-colors">
                            {count}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-10 border border-slate-800 rounded-[2.5rem] text-center text-slate-600 text-xs font-bold uppercase">
                No stats available
              </div>
            )}
          </aside>

          <main className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
                <p className="text-slate-500 text-xs font-black tracking-widest uppercase">
                  Fetching Feedback...
                </p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-24 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800">
                <p className="text-slate-600 text-xs font-black tracking-[0.2em] uppercase">
                  No matches found in database
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] transition-all hover:bg-slate-900/60 hover:border-slate-700/50 group"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-500 text-xl font-black shadow-inner group-hover:border-cyan-500/30 transition-colors">
                        {review.userId?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors uppercase">
                          {review.userId?.username}
                        </h4>
                        <p className="text-slate-500 font-mono text-[10px] mt-1">
                          {new Date(review.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-0.5 text-yellow-500 bg-slate-950/50 px-3 py-2 rounded-xl border border-slate-800/50">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={12}
                            className={
                              i < review.rating
                                ? "fill-current"
                                : "text-slate-800"
                            }
                          />
                        ))}
                      </div>
                      <span
                        className={`text-[9px] tracking-[0.15em] font-black px-2 py-1 rounded border w-fit ${getSentimentColor(
                          review.rating
                        )}`}
                      >
                        {review.rating >= 4
                          ? "POSITIVE"
                          : review.rating === 3
                          ? "NEUTRAL"
                          : "NEGATIVE"}
                      </span>
                    </div>
                  </div>
                  <div className="relative pl-8">
                    <p className="text-slate-300 leading-relaxed italic">
                      "{review.review}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventReviews;
