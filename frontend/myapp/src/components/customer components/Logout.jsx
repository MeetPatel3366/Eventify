import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../store/authSlice"; 

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();  
  const isAdmin = location.pathname.includes("/admin");
  const isOrganizer = location.pathname.includes("organizer");

  useEffect(() => {
    const doLogout = async () => {
      try {
        await dispatch(logoutUser());  
      } catch (err) {
        console.log(err);
      } finally {
        if (isAdmin) {
          navigate("/admin", { replace: true });
        } else if (isOrganizer) {
          navigate("/organizer", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }
    };
    doLogout();
  }, [dispatch, navigate, isAdmin, isOrganizer]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
