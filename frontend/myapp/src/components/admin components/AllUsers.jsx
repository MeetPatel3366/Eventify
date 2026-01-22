import { useSelector, useDispatch } from "react-redux";
import { deleteUser, fetchAllUsers } from "../../store/adminSlice";
import { useEffect } from "react";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state) => state.admin);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(id)).unwrap();
      dispatch(fetchAllUsers());
      console.log("Deleting user with ID:", id);
    }
  };

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-400">
          Customers
        </h1>

        {allUsers.length === 0 ? (
          <p className="text-gray-400 text-center">No customer found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-900/50 border border-gray-700 rounded-2xl shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800/50">
                  <th className="p-4 font-semibold text-gray-300">Sr. No.</th>
                  <th className="p-4 font-semibold text-gray-300">Username</th>
                  <th className="p-4 font-semibold text-gray-300">Email</th>
                  <th className="p-4 font-semibold text-gray-300">
                    Phone Number
                  </th>
                  <th className="p-4 font-semibold text-gray-300">
                    Joined Date
                  </th>
                  <th className="p-4 font-semibold text-center text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-4 font-medium">{index + 1}</td>
                    <td className="p-4 font-medium">{user.username}</td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4 text-gray-400">{user.phoneNumber}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
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

export default AllUsers;
