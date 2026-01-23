import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getMyProfile } from "../store/authSlice";

const CheckProfile = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !loading) {
      dispatch(getMyProfile());
    }
  }, [user, loading, dispatch]);

  useEffect(() => {
    if (!user) return;

    const needsCompletion =
      user.isOAuthUser && (!user.fullName || !user.phoneNumber);

    if (!needsCompletion) return;

    let target = "/my-profile";
    
    if (user.role === "eventorganizer") {
      target = "/organizer/my-profile";
    }

    if (location.pathname !== target) {
      navigate(target);
    }
  }, [user, location.pathname, navigate]);

  return children;
};

export default CheckProfile;
