import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const getRoleFromPath = (pathname) => {
    if (pathname.includes("/organizer")) return "eventorganizer";
    return "customer";
  };
  const role = getRoleFromPath(location.pathname);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await authApi.login(email, password);
      setMsg(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          navigate("/login-otp-verify", { state: { email } });
        }, 1200);
      }
    } catch (error) {
      if (error.response?.data?.needsVerification) {
        setMsg(error.response.data.message);
        setTimeout(() => {
          navigate("/verify-otp", { state: { email } });
        }, 1200);
      } else {
        setMsg(
          error.response?.data?.message ||
            "Invalid email or password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_GOOGLE_URL}?role=${role}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl border border-gray-200">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-indigo-600">
            Eventify
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, manage your events seamlessly
          </p>
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-900">
          Sign in to your account
        </h2>

        {msg && (
          <div className="mt-5 rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="font-medium text-indigo-600 hover:underline"
          >
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
