import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { NavLink } from "react-router-dom";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await adminApi.fetchAllContactMessages();
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Failed to fetch contact messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "new")
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    if (status === "read")
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    if (status === "replied")
      return "bg-green-500/20 text-green-400 border border-green-500/30";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Contact Messages</h1>
          <p className="text-gray-400">
            Manage and respond to customer contact requests
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No contact messages found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr className="text-left text-gray-300 text-sm uppercase">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {messages.map((msg) => (
                    <tr
                      key={msg._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 font-medium">
                        {msg.name}
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {msg.email}
                      </td>

                      <td className="px-6 py-4 text-gray-400 max-w-sm truncate">
                        {msg.message.substring(0, 30)}...
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            msg.status
                          )}`}
                        >
                          {msg.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <NavLink
                          to={`/admin/contact/${msg._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-sm shadow-lg"
                        >
                          Reply
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
