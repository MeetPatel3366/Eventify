import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <section className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-6xl font-extrabold leading-tight">
            Welcome to <span className="text-indigo-400">Eventify</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-xl">
            Your all-in-one platform to discover, manage, and enjoy unforgettable
            events — from concerts to conferences.
          </p>
          <div className="flex gap-6">
            <NavLink
              to="/events"
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-semibold shadow-xl shadow-indigo-500/30 transition"
            >
              Browse New Events
            </NavLink>
            <NavLink
              to="/my-events"
              className="px-10 py-4 border border-white/30 hover:bg-white/10 rounded-2xl font-semibold transition"
            >
              My Registrations
            </NavLink>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1505236858219-8359eb29e329"
            alt="Event Crowd"
            className="rounded-3xl shadow-2xl border border-white/20"
          />
          <div className="absolute -bottom-6 -left-6 bg-indigo-600 px-6 py-4 rounded-2xl shadow-xl text-sm">
            10,000+ Happy Attendees
          </div>
        </div>
      </section>

      <section className="bg-white/5 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="text-4xl font-bold text-indigo-400">500+</h3>
            <p className="text-gray-300 mt-2">Live Events</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-400">200+</h3>
            <p className="text-gray-300 mt-2">Trusted Organizers</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-400">50K+</h3>
            <p className="text-gray-300 mt-2">Registered Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-400">100%</h3>
            <p className="text-gray-300 mt-2">Secure Booking</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24 mt-8">
        <h2 className="text-4xl font-semibold text-center mb-14">Why Choose Eventify?</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
              alt="Browse Events"
              className="h-40 w-full object-cover rounded-2xl mb-5"
            />
            <h3 className="text-2xl font-semibold mb-2">Discover Events</h3>
            <p className="text-gray-300">
              Browse verified events created by trusted organizers.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
              alt="Register"
              className="h-40 w-full object-cover rounded-2xl mb-5"
            />
            <h3 className="text-2xl font-semibold mb-2">Easy Registration</h3>
            <p className="text-gray-300">
              Register and participate in events with a smooth experience.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b"
              alt="Enjoy Events"
              className="h-40 w-full object-cover rounded-2xl mb-5"
            />
            <h3 className="text-2xl font-semibold mb-2">Attend & Enjoy</h3>
            <p className="text-gray-300">
              Join events and create unforgettable memories.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40">
        <div className="max-w-7xl mx-auto px-6 py-28">
          <h2 className="text-4xl font-bold text-center mb-20">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="space-y-4">
              <div className="text-5xl font-extrabold text-indigo-400">01</div>
              <h3 className="text-2xl font-semibold">Find Events</h3>
              <p className="text-gray-300">
                Search events by category, date, or location.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-extrabold text-indigo-400">02</div>
              <h3 className="text-2xl font-semibold">Book Event</h3>
              <p className="text-gray-300">
                Book your event ticket, complete payment, and reserve your seat instantly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-extrabold text-indigo-400">03</div>
              <h3 className="text-2xl font-semibold">Attend & Enjoy</h3>
              <p className="text-gray-300">
                Join the event and create lasting memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-28 text-center">
        <h2 className="text-5xl font-extrabold mb-8">Explore More Events</h2>
        <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto">
          You’re already part of Eventify — continue exploring and enjoying
          amazing events tailored just for you.
        </p>
        <NavLink
          to="/events"
          className="inline-block px-14 py-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/40 transition"
        >
          View Events
        </NavLink>
      </section>
    </div>
  );
}

export default Home;