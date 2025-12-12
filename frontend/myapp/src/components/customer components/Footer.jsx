import React from "react";

const Footer = () => {
  return (
    <footer className="w-full fixed bottom-0 left-0 bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-gray-200 text-sm">

        <p>
          © {new Date().getFullYear()} Event Management System. All rights reserved.
        </p>

        <ul className="flex gap-6">
          <li>
            <a href="/privacy" className="hover:text-indigo-300 transition">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="/terms" className="hover:text-indigo-300 transition">
              Terms of Service
            </a>
          </li>
        </ul>

      </div>
    </footer>
  );
};

export default Footer;
