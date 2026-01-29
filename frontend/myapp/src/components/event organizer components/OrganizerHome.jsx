import { NavLink } from "react-router-dom";
import { FaCalendarPlus, FaListAlt, FaUsers } from "react-icons/fa";

const OrganizerHome = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Organizer <span className="text-indigo-400">Dashboard</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            Create, manage, and track your events effortlessly. Everything you
            need as an event organizer — all in one place.
          </p>
          <NavLink
            to="/organizer/events/add"
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-xl transition"
          >
            <FaCalendarPlus size={20} /> Create Event
          </NavLink>
        </div>

        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="Organize Events"
          className="rounded-3xl shadow-2xl border border-white/20"
        />
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-semibold text-center mb-14">Quick Actions</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          <NavLink
            to="/organizer/events/add"
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl hover:scale-[1.03] transition"
          >
            <FaCalendarPlus className="text-indigo-400 mx-auto mb-4" size={36} />
            <h3 className="text-2xl font-semibold mb-2">Add Event</h3>
            <p className="text-gray-300">Create and publish new events.</p>
          </NavLink>

          <NavLink
            to="/organizer/events"
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl hover:scale-[1.03] transition"
          >
            <FaListAlt className="text-indigo-400 mx-auto mb-4" size={36} />
            <h3 className="text-2xl font-semibold mb-2">My Events</h3>
            <p className="text-gray-300">View and manage your events.</p>
          </NavLink>

          <NavLink
            to="/organizer/events-stats"
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl hover:scale-[1.03] transition"
          >
            <FaUsers className="text-indigo-400 mx-auto mb-4" size={36} />
            <h3 className="text-2xl font-semibold mb-2">My Attendees</h3>
            <p className="text-gray-300">View attendees for your approved events.</p>
          </NavLink>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
          alt="Team Work"
          className="rounded-3xl shadow-xl border border-white/20 mx-auto mb-10"
        />
        <h2 className="text-4xl font-semibold mb-4">Built for Professional Organizers</h2>
        <p className="text-gray-300 text-lg">
          Your events are reviewed by administrators before publishing, ensuring
          quality and trust for all attendees.
        </p>
      </section>
    </>
  );
}

export default OrganizerHome