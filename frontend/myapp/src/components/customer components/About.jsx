import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-6 py-16">

      <section className="max-w-4xl mx-auto mb-12 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl mt-2">
        <h1 className="text-4xl font-bold mb-4">About Our Event Management System</h1>
        <p className="text-gray-300 text-lg">
          Welcome to the Event Management System! Our platform is designed to
          help organizations and individuals seamlessly manage and participate in events.
        </p>
      </section>

      <section className="max-w-4xl mx-auto mb-12 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold mb-3">Our Mission</h2>
        <p className="text-gray-300">
          Our mission is to simplify event management by offering an all-in-one,
          user-friendly platform for events of any size.
        </p>
      </section>

      <section className="max-w-4xl mx-auto mb-12 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Event Creation & Management</li>
          <li>Registration & Payment Processing</li>
          <li>Real-time Updates</li>
          <li>Analytics & Insights</li>
          <li>Customizable Event Pages</li>
        </ul>
      </section>

      <section className="max-w-4xl mx-auto mb-12 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold mb-4">Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li><strong>User-Friendly:</strong> Intuitive interface for everyone.</li>
          <li><strong>Scalable:</strong> Suitable for small to massive events.</li>
          <li><strong>Secure Payments:</strong> Safe and trusted payment gateways.</li>
          <li><strong>Customer Support:</strong> Reliable help whenever you need it.</li>
        </ul>
      </section>

      <section className="max-w-4xl mx-auto mb-12 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold mb-3">Contact Us</h2>
        <p className="text-gray-300 mb-3">
          If you have any questions or need assistance, feel free to reach out:
        </p>
        <ul className="space-y-1 text-gray-300">
          <li><strong>Email:</strong> support@eventmanagement.com</li>
          <li><strong>Phone:</strong> +123-456-7890</li>
          <li><strong>Address:</strong> 123 Event Street, New York, NY 10001</li>
        </ul>
      </section>

    </div>
  );
};

export default About;
