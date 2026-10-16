import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoadingPortal from "../components/ui/LoadingPortal";
import { apiRequest } from "../lib/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Create a function that ONLY clears data (Safe for useEffect)
  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem("HTN_user");
    Cookies.remove("authToken");
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("authToken");
      const savedUser = localStorage.getItem("HTN_user");

      if (token && savedUser && savedUser !== "undefined") {
        try {
          const response = await apiRequest("/auth/status", "GET", null, true);

          if (response && response.user) {
            setUser(response.user);
            localStorage.setItem("HTN_user", JSON.stringify(response.user));
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.error("Auth Validation Failed:", error.message);
          clearAuthData();
        }
      } else {
        clearAuthData(); // Just clear data, DON'T navigate here
      }

      // Branded loader delay
      setTimeout(() => setLoading(false), 800);
    };

    initAuth();
  }, []);

  const loginUser = (userData, token) => {
    if (!userData || !token) return;
    setUser(userData);
    localStorage.setItem("HTN_user", JSON.stringify(userData));
    Cookies.set("authToken", token, {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });
  };

  // 2. This function is for EXPLICIT logout (Button clicks)
  const logoutUser = () => {
    clearAuthData();
    navigate("/HTN-gate/login");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {loading ? <LoadingPortal /> : children}
    </AuthContext.Provider>
  );
};

// Make sure this is at the very bottom
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
