import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await authApi.login(email, password);
      setMsg(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          navigate("/login-otp-verify", { state: { email } })
        }, 1500)
      }
    } catch (error) {
      if (error.response?.data?.needsVerification) {
        setMsg(error.response.data.message)

        setTimeout(() => {
          navigate("/verify-otp", { state: { email } });
        }, 1500)
      }
      else {
        console.log("login error", error.response.data.message);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_BACKEND_GOOGLE_URL;
  }

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


          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white shadow-lg shadow-indigo-500/30"
          >
            Login
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10"></span>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-slate-900 px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white hover:bg-gray-100 transition font-semibold text-gray-900 shadow-lg"
        >
          <FcGoogle size={22} />
          <span>Login with Google</span>
        </button>

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
