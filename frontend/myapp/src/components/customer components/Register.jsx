import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const isFormValid =
    username &&
    email &&
    password &&
    confirmpassword &&
    !usernameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError;

  const navigate = useNavigate();
  const location = useLocation();
  const isOrganizer = location.pathname.includes("organizer");

  const handleUsernameChange = (e) => {
    setMsg("");
    const value = e.target.value;
    setUsername(value);

    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{6,}$/;

    if (!value) {
      setUsernameError("");
    } else if (/^\d+$/.test(value)) {
      setUsernameError("Username cannot contain only numbers.");
    } else if (!usernameRegex.test(value)) {
      setUsernameError(
        "Username must be at least 6 characters and include letters and numbers."
      );
    } else {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e) => {
    setMsg("");
    const value = e.target.value;
    setPassword(value);

    const PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!value) {
      setPasswordError("");
    } else if (!PASSWORD_REGEX.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setMsg("");
    const value = e.target.value;
    setConfirmpassword(value);
  };
  useEffect(() => {
    if (!confirmpassword) {
      setConfirmPasswordError("");
    } else if (confirmpassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmpassword]);

  const handleEmailChange = (e) => {
    setMsg("");
    const value = e.target.value.trim();
    setEmail(value);

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!value) {
      setEmailError("");
    } else if (!EMAIL_REGEX.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmpassword) {
      setMsg("Please fill in all fields.");
      return;
    }

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setMsg("Please fix the errors before submitting.");
      return;
    }

    const role = isOrganizer ? "eventorganizer" : "customer";

    try {
      setLoading(true);
      const res = await authApi.register(
        username,
        email,
        password,
        confirmpassword,
        role
      );

      setMsg(res.data.message);

      if (res.data.success) {
        const path = isOrganizer ? "/organizer/verify-otp" : "/verify-otp";
        setTimeout(() => navigate(path, { state: { email } }), 1200);
      }
    } catch (error) {
      setMsg(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200">
      <div className="hidden md:flex items-center justify-center">
        <img
          src="/images/register.png"
          alt="Auth"
          className="max-w-[75%] h-auto"
        />
      </div>
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl border border-gray-200">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-indigo-600">Eventify</h1>
            <p className="mt-1 text-center text-sm text-gray-500">
              {isOrganizer
                ? "Start managing your events professionally"
                : "Join Eventify to discover amazing events"}
            </p>
          </div>

          <h2 className="text-center text-2xl font-semibold text-gray-900">
            {isOrganizer ? "Organizer Registration" : "Create Your Account"}
          </h2>

          {msg && (
            <div className="mt-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm text-red-700 text-center">
              {msg}
            </div>
          )}

          <form noValidate onSubmit={onSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {usernameError && (
                <p className="mt-1 text-xs text-red-600">{usernameError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />

              {emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
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
              {passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmpassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
                {confirmPasswordError && (
                  <p className="mt-1 text-xs text-red-600">
                    {confirmPasswordError}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink
              to={isOrganizer ? "/organizer" : "/"}
              className="font-medium text-indigo-600 hover:underline"
            >
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
