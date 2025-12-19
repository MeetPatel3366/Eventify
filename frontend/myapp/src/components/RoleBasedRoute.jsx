import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const RoleBasedRoute = ({ children, allowedRoles }) => {
    const {isAuthenticated,role,loading}=useSelector((state)=>state.auth)

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) {
        console.log("no token, redirecting to login")
        return <Navigate to="/" replace />;
    }

    // eslint-disable-next-line react/prop-types
    if (!allowedRoles.includes(role)) {
        if (role === "admin") return <Navigate to="/admin/home" replace />;
        if (role === "eventorganizer") return <Navigate to="/organizer/home" replace />;
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default RoleBasedRoute