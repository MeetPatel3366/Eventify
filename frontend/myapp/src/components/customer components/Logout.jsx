import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import authApi from "../../api/authApi";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = location.pathname.includes("/admin");
  const isOrganizer = location.pathname.includes("organizer");

  useEffect(() => {
    const doLogout = async () => {
      try {
        await authApi.logout();
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(logout());
        if (isAdmin) {
          navigate("/admin", { replace: true });
        } else if (isOrganizer) {
          navigate("/organizer", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    };
    doLogout();
  }, [dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
