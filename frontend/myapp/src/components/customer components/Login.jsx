import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css"; // Custom CSS for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Fetch users from local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Find the user with matching credentials
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "employee") {
        navigate("/employee");
      } else if (user.role === "customer") {
        navigate("/customer");
      }
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Eventify Login</h2>
        {error && <p className="error-message">{error}</p>}
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
