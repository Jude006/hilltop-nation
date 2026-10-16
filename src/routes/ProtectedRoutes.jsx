import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock } from "lucide-react";
import Cookies from "js-cookie";

const ProtectedRoutes = ({ allowedRoles = [], requiredPermission = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const token = Cookies.get("authToken");

  /**
   * STAGE 1: SYNC CHECK
   * If AuthContext is still fetching user data from the backend,
   * we return null (or a spinner) so we don't redirect prematurely.
   */
  if (loading) {
    return null;
  }

  /**
   * STAGE 2: AUTHENTICATION CHECK
   * If there is no active user or no token, redirect to the login page.
   * We save the 'location' so we can send them back where they were after login.
   */
  if (!user || !token) {
    return <Navigate to="/HTN-gate/login" state={{ from: location }} replace />;
  }

  // Normalize data for comparison
  const userRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

  /**
   * STAGE 3: ROLE AUTHORIZATION
   * Admins bypass role checks.
   * Everyone else must have their role included in the allowedRoles array.
   */
  if (
    normalizedAllowedRoles.length > 0 &&
    userRole !== "admin" &&
    !normalizedAllowedRoles.includes(userRole)
  ) {
    // If unauthorized for this specific role, send back to home
    return <Navigate to="/" replace />;
  }

  /**
   * STAGE 4: PERMISSION AUTHORIZATION (SOFT BLOCK)
   * Admins bypass permission checks.
   * If a specific permission is required but missing, show the Access Restricted UI.
   */
  if (userRole !== "admin" && requiredPermission) {
    const hasPermission = user.permissions?.includes(requiredPermission);

    if (!hasPermission) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6 font-albert-sans">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-pulse">
            <Lock className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-black tracking-tighter text-primary uppercase">
            Access Restricted
          </h2>
          <p className="mt-2 text-[10px] font-black tracking-widest text-primary/30 uppercase">
            Required: {requiredPermission}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoutes;
