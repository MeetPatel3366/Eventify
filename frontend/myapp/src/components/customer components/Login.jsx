import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../styles/Login.module.css";
import { setAuth } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import authApi from "../../../api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const disptach = useDispatch()

  const onSubmit = async (e) => {
    e.preventDefault();

    const res = await authApi.login(email, password)

    setMsg(res.data.message)

    if (res.data.success) {
      const token = res.data.token;
      const role = res.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      disptach(setAuth({ token, role }))

      if (res.data.role == "admin") {
        navigate("/admin")
      }
      else if (res.data.role == "eventorganizer") {
        navigate("/eventorganizer")
      }
      else {
        navigate("/customer")
      }
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-form']}>
        <h2>Eventify Login</h2>
        {msg && <p>{msg}</p>}
        <form onSubmit={onSubmit}>
          <div className={styles['form-group']}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles['login-button']}>
            Login
          </button>
        </form>
        <p>Don&apos;t Have an account? <NavLink to="/register">Register</NavLink></p>
      </div>
    </div>
  );
};

export default Login;