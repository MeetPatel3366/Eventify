import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Register.css"; // Custom CSS for styling
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [msg, setMsg] = useState("")
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMsg("Please fill in all fields.");
      return;
    }

    const res = await axios.post("http://localhost:4000/api/auth/register", { email, password, role })
    setMsg(res.data.message);

    if (res.data.success) {
      setTimeout(() => {
        navigate("/")
      }, 1500)
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Eventify Registration</h2>
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
          <div className="form-group">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="eventorganizer">Event Organizer</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
