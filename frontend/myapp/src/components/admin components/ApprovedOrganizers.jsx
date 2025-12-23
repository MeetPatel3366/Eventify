import { useSelector } from "react-redux";

const ApprovedOrganizers = () => {
  const { approvedOrganizers } = useSelector((state) => state.admin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Approved Organizers
      </h1>

      {approvedOrganizers.length === 0 ? (
        <p className="text-gray-400 text-center">No approved organizers</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {approvedOrganizers.map((org) => (
            <div
              key={org._id}
              className="bg-gray-900 border border-green-700/40 rounded-2xl
                         shadow-lg p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold
                                 rounded-full bg-green-700/20 text-green-400">
                  Approved
                </span>
              </div>

              <div>
                <p className="text-lg font-semibold">{org.username}</p>
                <p className="text-sm text-gray-400 break-all">{org.email}</p>
              </div>

              {org.createdAt && (
                <p className="mt-3 text-xs text-gray-500">
                  Joined on {new Date(org.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedOrganizers;
