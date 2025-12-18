import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const OrganizerApproval = () => {
  const [organizers, setOrganizers] = useState([]);

  const fetchOrganizers = async () => {
    const res = await adminApi.fetchOrganizers()
    setOrganizers(res.data.organizers);
  };

  const approve = async (id) => {
    await adminApi.approveOrganizer(id)
    fetchOrganizers();
  };

  const reject = async (id) => {
    await adminApi.rejectOrganizer(id)
    fetchOrganizers();
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Organizer Approval Requests</h1>

      {organizers.length === 0 ? (
        <p className="text-gray-400">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {organizers.map((org) => (
            <div
              key={org._id}
              className="flex justify-between items-center bg-gray-900 border border-gray-800 p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">{org.username}</p>
                <p className="text-sm text-gray-400">{org.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approve(org._id)}
                  className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(org._id)}
                  className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerApproval;
