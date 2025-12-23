import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import authApi from "../../api/authApi";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const doLogout = async () => {
      try {
        await authApi.logout();
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(logout());
        navigate("/", { replace: true });
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
