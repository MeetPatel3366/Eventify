import React from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Welcome to <span className="text-indigo-400">Eventify</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            Your all-in-one platform to discover, manage, and enjoy unforgettable
            events — from concerts to conferences.
          </p>
          <NavLink
            to="/customer/events"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/30 transition"
          >
            Explore Events
          </NavLink>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1505236858219-8359eb29e329"
            alt="Event Crowd"
            className="rounded-3xl shadow-2xl border border-white/20"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
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
    </div>
  );
}
