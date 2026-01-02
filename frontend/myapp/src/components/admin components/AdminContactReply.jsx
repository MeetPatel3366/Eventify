import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";

const AdminContactReply = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await adminApi.fetchSingleContactMessage(id);
        setMessage(res.data.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load message");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const handleReply = async () => {
    if (!reply.trim()) {
      setError("Reply message cannot be empty");
      return;
    }

    setSending(true);
    setError("");

    try {
      await adminApi.replyToContactMessage(id, { reply });
      navigate("/admin/contact-messages");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center text-gray-400">
        Loading message...
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center text-red-400">
        Message not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reply to Contact Message</h1>
          <p className="text-gray-400">
            Respond to customer inquiries directly from the admin panel
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="font-semibold">{message.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-semibold">{message.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Message</p>
            <p className="text-gray-300 whitespace-pre-line">
              {message.message}
            </p>
          </div>

          <div className="mt-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                ${
                  message.status === "new"
                    ? "bg-red-500/20 text-red-400"
                    : message.status === "read"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
            >
              {message.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Your Reply</h2>

          <textarea
            rows="6"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply here..."
            className="w-full p-4 rounded-xl bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40 resize-none"
          />

          {error && (
            <p className="text-red-400 text-sm mt-3">{error}</p>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate("/admin/contact")}
              className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleReply}
              disabled={sending || message.status === "replied"}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactReply;
