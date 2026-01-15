import { useContext, createContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LOGIN
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false };
    }
  };

  // REGISTER
  const register = async (username, email, password) => {
    try {
      setError(null);
      const res = await API.post("/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false };
    }
  };

  // AUTO LOGIN / CHECK SESSION
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
