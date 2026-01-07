import { useSelector } from "react-redux";

const RejectedOrganizers = () => {
    const { rejectedOrganizers } = useSelector((state) => state.admin);

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-center">
                Rejected Organizers
            </h1>

            {rejectedOrganizers.length === 0 ? (
                <p className="text-gray-400 text-center">No rejected organizers</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rejectedOrganizers.map((org) => (
                        <div
                            key={org._id}
                            className="bg-gray-900 border border-red-700/40 rounded-2xl
                         shadow-lg p-6 hover:shadow-2xl transition-shadow"
                        >
                            <div className="mb-3">
                                <span className="inline-block px-3 py-1 text-xs font-semibold
                                 rounded-full bg-red-700/20 text-red-400">
                                    Rejected
                                </span>
                            </div>

                            <div>
                                <p className="text-lg font-semibold">{org.username}</p>
                                <p className="text-sm text-gray-400 break-all">{org.email}</p>
                            </div>

                            {org.rejectionReason && (
                                <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-xl">
                                    <p className="text-xs text-red-300 font-medium">
                                        Reason:
                                    </p>
                                    <p className="text-sm text-red-400">
                                        {org.rejectionReason}
                                    </p>
                                </div>
                            )}

                            {org.updatedAt && (
                                <p className="mt-3 text-xs text-gray-500">
                                    Rejected on {new Date(org.updatedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default RejectedOrganizers;
