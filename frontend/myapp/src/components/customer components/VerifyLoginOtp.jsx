import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux"
import { setAuth } from "../../store/authSlice";
import authApi from "../../api/authApi";

const VerifyLoginOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const [serachParams] = useSearchParams()

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const email = serachParams.get("email") || location.state?.email;

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otp) {
            setError("OTP is required");
            return;
        }

        try {
            setLoading(true);
            const res = await authApi.verifyLoginOtp(email, otp)

            if (res.data.success) {
                setSuccess("Login successful");

                // const token = res.data.token;
                const role = res.data.role;
                // localStorage.setItem("token", token);
                localStorage.setItem("role", role);
                dispatch(setAuth({ role }));

                setTimeout(() => {
                    if (res.data.role === "eventorganizer") {
                        navigate("/organizer/home");
                    } else {
                        navigate("/home");
                    }
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "verification failed");
            setTimeout(() => {
                navigate(-1)
            }, 1500)
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

                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    Verify Login OTP
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

                <form onSubmit={handleVerify} className="space-y-4">
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
                    OTP expires in 10 minutes
                </p>
            </div>
        </div>
    );
};

export default VerifyLoginOtp;
