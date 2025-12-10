import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any user authentication data (localStorage, sessionStorage, etc.)
    localStorage.removeItem("authToken"); // Example if using localStorage
    sessionStorage.clear(); // Example if using sessionStorage

    // Add any additional logout logic if needed (like API call to invalidate token)

    // Navigate to the initial page (home page or login page)
    navigate("/");
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
