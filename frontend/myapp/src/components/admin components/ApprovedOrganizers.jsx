import { useSelector, useDispatch } from "react-redux";
import { deleteUser, fetchApprovedOrganizers } from "../../store/adminSlice";
import { useEffect } from "react";

const ApprovedOrganizers = () => {
  const dispatch = useDispatch();
  const { approvedOrganizers } = useSelector((state) => state.admin);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this organizer?")) {
      await dispatch(deleteUser(id)).unwarp();
      dispatch(fetchApprovedOrganizers());
      console.log("Deleting organizer with ID:", id);
    }
  };

  useEffect(() => {
    dispatch(fetchApprovedOrganizers());
  }, [dispatch]);

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-400">
          Approved Organizers
        </h1>

        {approvedOrganizers.length === 0 ? (
          <p className="text-gray-400 text-center">
            No approved organizers found.
          </p>
        ) : (
          <div className="overflow-x-auto bg-gray-900/50 border border-gray-700 rounded-2xl shadow-xl">
            <table className="w-full text-left border-collapse ">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800/50">
                  <th className="p-4 font-semibold text-gray-300">Sr. No.</th>
                  <th className="p-4 font-semibold text-gray-300">Username</th>
                  <th className="p-4 font-semibold text-gray-300">Full Name</th>
                  <th className="p-4 font-semibold text-gray-300">Email</th>
                  <th className="p-4 font-semibold text-gray-300">
                    Phone Number
                  </th>
                  <th className="p-4 font-semibold text-gray-300">
                    Joined Date
                  </th>
                  <th className="p-4 font-semibold text-gray-300">Status</th>
                  <th className="p-4 font-semibold text-center text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedOrganizers.map((org, index) => (
                  <tr
                    key={org._id}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-4 font-medium">{index + 1}</td>
                    <td className="p-4 font-medium">{org.username}</td>
                    <td className="p-4 font-medium">{org.fullName}</td>
                    <td className="p-4 text-gray-400">{org.email}</td>
                    <td className="p-4 text-gray-400">{org.phoneNumber}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-700/20 text-green-400 border border-green-700/30">
                        Approved
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(org._id)}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ApprovedOrganizers;
