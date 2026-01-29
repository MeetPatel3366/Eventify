import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { fetchBookingAnalytics } from "../../store/bookingSlice";
import { TrendingUp, Users, Calendar, IndianRupee, Award } from "lucide-react";

export default function BookingAnalytics() {
  const dispatch = useDispatch();
  const { dailyBookings, dailyRevenue, topEvents, topOrganizers } = useSelector(
    (s) => s.booking,
  );

  useEffect(() => {
    dispatch(fetchBookingAnalytics());
  }, [dispatch]);

  const mergedDailyData = useMemo(() => {
    if (!dailyBookings) return [];
    const map = new Map();
    dailyBookings.forEach((item) => {
      const existing = map.get(item.date) || 0;
      map.set(item.date, existing + item.ticketsSold);
    });
    return Array.from(map, ([date, ticketsSold]) => ({
      date,
      ticketsSold,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [dailyBookings]);

  const totalRevenue =
    dailyRevenue?.reduce((acc, curr) => acc + curr.revenue, 0) || 0;
  const totalTickets =
    dailyBookings?.reduce((acc, curr) => acc + curr.ticketsSold, 0) || 0;

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">
            Real-time performance metrics and financial overview.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 lg:max-w-4xl">
          <StatCard
            title="Revenue"
            value={`₹ ${totalRevenue.toLocaleString()}`}
            icon={<IndianRupee size={18} className="text-emerald-400" />}
            color="emerald"
          />
          <StatCard
            title="Tickets Sold"
            value={totalTickets}
            icon={<Calendar size={18} className="text-sky-400" />}
            color="sky"
          />
          <StatCard
            title="Active Organizers"
            value={topOrganizers?.length || 0}
            icon={<Users size={18} className="text-indigo-400" />}
            color="indigo"
          />
          <StatCard
            title="Top Event"
            value={topEvents?.[0]?.eventName || "N/A"}
            icon={<Award size={18} className="text-amber-400" />}
            color="amber"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
        <section className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
              <TrendingUp size={22} />
            </div>
            Tickets Trend
          </h2>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mergedDailyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" />
                <YAxis allowDecimals={false} stroke="#475569" />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#e2e8f0",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#22d3ee", fontWeight: "bold" }}
                />

                <Area
                  type="monotone"
                  dataKey="ticketsSold"
                  stroke="#22d3ee"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tight text-emerald-400">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <IndianRupee size={22} />
            </div>
            Revenue Stream
          </h2>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="_id" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#e2e8f0",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                />

                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-100 border-b-2 border-cyan-500/50 pb-1">
              Popular Events Rank
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-widest font-bold">
                  <th className="pb-5">Event</th>
                  <th className="pb-5">Category</th>
                  <th className="pb-5">Price</th>
                  <th className="pb-5 text-right">Tickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {topEvents?.map((e) => (
                  <tr
                    key={e._id}
                    className="hover:bg-slate-800/20 transition-all group"
                  >
                    <td className="py-6 font-bold text-slate-200 group-hover:text-cyan-400">
                      {e.eventName}
                    </td>
                    <td className="py-6">
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] border border-slate-700 font-bold uppercase text-slate-400">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-6 font-bold text-slate-200 group-hover:text-cyan-400">
                      {e.price}
                    </td>
                    <td className="py-6 text-right font-black text-xl text-cyan-500 font-mono">
                      {e.totalBookings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-100 border-b-2 border-cyan-500/50 pb-1">
              Organizer Leaderboard
            </h2>
          </div>
          <div className="space-y-4">
            {topOrganizers?.map((o) => (
              <div
                key={o._id}
                className="flex items-center justify-between p-5 bg-slate-950/50 rounded-3xl border border-slate-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-black text-sm border border-indigo-500/20">
                    {o.organizerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-100 text-sm">
                      {o.organizerName.split("_")[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                      {o.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-black text-lg font-mono">
                    ₹{o.revenue.toLocaleString()}
                  </p>
                  <p className="text-[8px] text-slate-600 font-bold uppercase">
                    Net Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    emerald: "border-emerald-500/20 hover:border-emerald-500/40",
    sky: "border-sky-500/20 hover:border-sky-500/40",
    indigo: "border-indigo-500/20 hover:border-indigo-500/40",
    amber: "border-amber-500/20 hover:border-amber-500/40",
  };

  return (
    <div
      className={`p-5 rounded-3xl border bg-slate-900/40 backdrop-blur-md transition-all duration-300 shadow-lg ${colorMap[color]}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
          {icon}
        </div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">
          {title}
        </p>
      </div>
      <h3 className="text-xl font-black text-slate-100 font-mono tracking-tighter truncate">
        {value}
      </h3>
    </div>
  );
}
