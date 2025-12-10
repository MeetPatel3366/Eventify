import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import axios from "axios";

const Login = () => {
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
    <div className="login-container">
      <div className="login-form">
        <h2>Eventify Login</h2>
        {msg && <p>{msg}</p>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
