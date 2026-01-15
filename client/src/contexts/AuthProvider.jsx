import { useEffect, useState } from "react";
import api from "../services/axios";
import { AuthContext } from "./authContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const hydrate = async () => {
      try {
        const res = await api.get("/auth/refresh");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate('/');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
