import React from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center px-4">
      
      <section className="relative w-full max-w-3xl text-center text-white p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        
        <h1 className="text-4xl font-extrabold mb-4 tracking-wide">
          Welcome to Eventify
        </h1>

        <p className="text-gray-200 text-lg max-w-xl mx-auto mb-8">
          Your all-in-one platform to plan, manage and celebrate your events effortlessly.
        </p>

        <NavLink
          to="/customer/events"
          className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition"
        >
          Explore Events
        </NavLink>

      </section>

    </div>
  );
}
