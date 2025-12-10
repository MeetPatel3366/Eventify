import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get("http://localhost:4000/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (!res.data.success) {
        localStorage.clear();
        setRole(null);
        setToken(null);
      }
    })
    .finally(() => setLoading(false));
  }, [token]);

  return (
    <AuthContext.Provider value={{ loading, role, token, setRole, setToken }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
