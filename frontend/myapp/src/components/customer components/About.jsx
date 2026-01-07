import React from "react";
import { NavLink } from "react-router-dom";

const About = () => {
  return (
    <>
      <section className="max-w-6xl mx-auto mb-20 grid md:grid-cols-2 gap-10 items-center mt-10">
        <div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Discover & Join <span className="text-indigo-400">Amazing Events</span>
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Our Event Management System lets customers easily explore, register,
            and participate in events created by trusted organizers.
          </p>
          <NavLink to="/events">
            <button className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition shadow-lg">
              Browse Events
            </button>
          </NavLink>
        </div>
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865"
          alt="Attend Events"
          className="rounded-3xl shadow-2xl border border-white/20"
        />
      </section>

      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-4xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
              alt="Browse Events"
              className="h-40 w-full object-cover rounded-2xl mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">Browse Events</h3>
            <p className="text-gray-300">
              Explore upcoming events approved by administrators.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
              alt="Register"
              className="h-40 w-full object-cover rounded-2xl mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">Register Easily</h3>
            <p className="text-gray-300">
              Sign up or log in securely to register for events.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1503428593586-e225b39bddfe"
              alt="Attend"
              className="h-40 w-full object-cover rounded-2xl mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">Attend & Enjoy</h3>
            <p className="text-gray-300">
              Join events and enjoy a smooth, hassle-free experience.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mb-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <h2 className="text-4xl font-semibold mb-6">Why Customers Love Us</h2>
          <ul className="space-y-4 text-gray-300 text-lg">
            <li>✔ Verified & approved events only</li>
            <li>✔ Simple registration & login</li>
            <li>✔ Real-time event updates</li>
            <li>✔ Secure and reliable platform</li>
          </ul>
        </div>
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          alt="Happy Audience"
          className="rounded-3xl shadow-xl border border-white/20"
        />
      </section>

      <section className="max-w-4xl mx-auto mb-20 text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-xl">
        <h2 className="text-4xl font-semibold mb-4">Safe & Trusted</h2>
        <p className="text-gray-300 text-lg">
          All events are reviewed by administrators before being published,
          ensuring a trustworthy experience for every customer.
        </p>
      </section>
    </>
  );
}

export default About;