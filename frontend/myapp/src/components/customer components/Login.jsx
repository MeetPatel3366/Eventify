import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/authSlice";
import authApi from "../../../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await authApi.login(email, password);
    setMsg(res.data.message);

    if (res.data.success) {
      const token = res.data.token;
      const role = res.data.role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      dispatch(setAuth({ token, role }));

      if (role === "admin") navigate("/admin");
      else if (role === "eventorganizer") navigate("/eventorganizer");
      else navigate("/customer");
    }
  };

  return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black px-4">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
              Eventify Login
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


              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white shadow-lg shadow-indigo-500/30"
              >
                Login
              </button>
            </form>


            <p className="text-center text-gray-300 mt-6">
              Don’t have an account?{' '}
              <NavLink
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Register
              </NavLink>
            </p>
          </div>
        </div>
      
      );
}
