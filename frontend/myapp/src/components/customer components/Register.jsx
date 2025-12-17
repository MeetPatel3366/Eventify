import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation()
  const isOrganizer = location.pathname.includes("organizer");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmpassword) {
      setMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmpassword) {
      setMsg("Password & Confirmpassword does not match")
      return;
    }

    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!PASSWORD_REGEX.test(password)) {
      setMsg("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      return;
    }

    const role = isOrganizer ? "eventorganizer" : "customer";

    try {
      const res = await authApi.register(username, email, password, confirmpassword, role);
      setMsg(res.data.message);

      if (res.data.success) {
        const path = isOrganizer ? "/organizer/verify-otp" : "/verify-otp"

        setTimeout(() => {
          navigate(path, { state: { email: email } })
        }, 1500)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "something went wrong. please try again later.";
      setMsg(errorMsg)
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
            <label className="text-gray-200 mb-1 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
          </p>

          <div className="flex flex-col">
            <label className="text-gray-200 mb-1 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
            to={isOrganizer ? "/organizer" : "/"}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;