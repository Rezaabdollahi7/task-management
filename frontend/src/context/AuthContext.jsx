// src/context/AuthContext.jsx
// Authentication context for managing user state globally

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // Verify token with server
          const response = await authAPI.getMe();
          setUser(response.data);
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.login({ username, password });

      const { token, user: userData } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setUser(userData);
      setLoading(false);

      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear localStorage and state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // Check if user is manager
  const isManager = () => {
    return user?.role === "manager";
  };

  // Check if user is employee
  const isEmployee = () => {
    return user?.role === "employee";
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isManager,
    isEmployee,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
