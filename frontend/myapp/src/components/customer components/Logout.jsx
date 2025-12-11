import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch()

  useEffect(() => {
    dispatch(logout())
    navigate("/");
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
