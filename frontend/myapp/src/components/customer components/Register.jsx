import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMsg("Please fill in all fields.");
      return;
    }

    const res = await authApi.register(email, password, role);
    setMsg(res.data.message);

    if (res.data.success) {
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8">

        <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
          Eventify Registration
        </h2>

        {msg && (
          <p className="text-center mb-4 text-sm text-yellow-200 bg-yellow-800/20 p-2 rounded-xl">
            {msg}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-5">

          <div className="flex flex-col">
            <label className="text-gray-200 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-200 mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-200 mb-1 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="admin" className="text-black">Admin</option>
              <option value="eventorganizer" className="text-black">Event Organizer</option>
              <option value="customer" className="text-black">Customer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white shadow-lg shadow-indigo-500/30"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <NavLink
            to="/"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}
