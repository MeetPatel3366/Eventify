import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import authApi from "../../api/authApi";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOrganizer = location.pathname.includes("organizer");
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.verifyOtp(email, otp)

      if (res.data.success) {
        setSuccess("OTP verified successfully");
        const path = isOrganizer ? "/organizer" : "/"

        setTimeout(() => {
          navigate(path)
        }, 1500)
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        Invalid access
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-400 text-center mb-6">
          Enter the OTP sent to <br />
          <span className="text-gray-200 font-medium">{email}</span>
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-950 border border-red-800 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-400 bg-green-950 border border-green-800 px-3 py-2 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Didn’t receive the OTP? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
