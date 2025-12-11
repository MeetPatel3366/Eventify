import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const RoleBasedRoute = ({ children, allowedRoles }) => {
    const {token,role,loading}=useSelector((state)=>state.auth)

    if (loading) return <div>Loading...</div>;

    if (!token) {
        return <Navigate to="/" replace />;
    }

    // eslint-disable-next-line react/prop-types
    if (!allowedRoles.includes(role)) {
        if (role === "admin") return <Navigate to="/admin" replace />;
        if (role === "eventorganizer") return <Navigate to="/eventorganizer" replace />;
        return <Navigate to="/customer" replace />;
    }

    return children;
};

export default RoleBasedRoute