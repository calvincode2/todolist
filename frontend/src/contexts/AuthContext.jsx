import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Axios instance dengan base URL
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request interceptor - tambahkan token ke semua request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token && token.trim() !== "") {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle 401 unauthorized
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token tidak valid atau expired, hapus dari localStorage
        localStorage.removeItem("token");
        setUser(null);
        // Redirect ke login jika bukan di halaman login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Validasi token ke backend
      api
        .get("/me")
        .then((response) => {
          setUser(response.data.user);
          setLoading(false);
        })
        .catch(() => {
          // Token tidak valid, hapus dari localStorage
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
