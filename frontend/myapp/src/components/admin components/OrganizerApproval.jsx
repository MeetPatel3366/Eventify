import { useDispatch, useSelector } from "react-redux";
import { approveOrganizer, rejectOrganizer } from "../../store/adminSlice";

const OrganizerApproval = () => {
  const { pendingOrganizers } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Organizer Approval Requests
      </h1>

      {pendingOrganizers.length === 0 ? (
        <p className="text-gray-400 text-center">No pending requests</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pendingOrganizers.map((org) => (
            <div
              key={org._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-6
                         hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <p className="text-lg font-semibold">{org.username}</p>
                <p className="text-sm text-gray-400 break-all">{org.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => dispatch(approveOrganizer(org._id))}
                  className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700
                             transition-colors duration-200 font-medium"
                >
                  Approve
                </button>

                <button
                  onClick={() => dispatch(rejectOrganizer(org._id))}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700
                             transition-colors duration-200 font-medium"
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
