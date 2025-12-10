import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Login.module.css"; 
import axios from "axios";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const { setRole, setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:4000/api/auth/login", {
      email, password
    })

    setMsg(res.data.message)

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setToken(res.data.token);
      setRole(res.data.role)

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
      </div>
    </div>
  );
};

export default Login;