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

const MyEventReviews = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { reviews, summary, loading } = useSelector((state) => state.review);

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
    <div className="max-w-6xl mx-auto px-4 py-8 h-fit text-slate-200">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors"
      >
        <FaChevronLeft size={12} /> Return to bookings
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            Event Reviews
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage attendee feedback and sentiment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
            <FaFilter className="text-indigo-500 text-xs" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">
                All Ratings
              </option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n} className="bg-slate-900 text-white">
                  {n} Stars
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
            <FaSortAmountDown className="text-indigo-500 text-xs" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900 text-white">
                Newest First
              </option>
              <option value="highest" className="bg-slate-900 text-white">
                Highest Rated
              </option>
              <option value="lowest" className="bg-slate-900 text-white">
                Lowest Rated
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <aside className="lg:col-span-4 h-fit">
          {stats && (
            <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl sticky top-8">
              <h2 className="text-white font-bold text-xl mb-3">
                Performance Score
              </h2>
              <div className="flex items-end gap-3 mb-10">
                <span className="text-7xl font-black text-yellow-400 leading-none">
                  {stats.avg}
                </span>
                <div className="mb-2">
                  <div className="flex text-yellow-500 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={14}
                        className={
                          i < Math.round(stats.avg)
                            ? "fill-current"
                            : "text-slate-600"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    {stats.count} Reviews
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.breakdown?.[star] || 0;
                  const progress =
                    stats.count > 0 ? (count / stats.count) * 100 : 0;
                  return (
                    <div key={star} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-400">{star} Stars</span>
                        <span className="text-slate-200">{count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        <main className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <p className="text-slate-500 text-sm">
                No reviews found matching your criteria.
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl transition-all hover:bg-slate-800/50"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-lg">
                      {review.userId?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-white font-bold leading-tight">
                        {review.userId?.username}
                      </h4>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "fill-current"
                              : "text-slate-700"
                          }
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[9px] tracking-widest font-black px-2 py-0.5 rounded-md border ${getSentimentColor(
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

                <div className="sm:pl-16 text-slate-300">
                  <p className="text-base leading-relaxed">"{review.review}"</p>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default MyEventReviews;
