import Cookies from "js-cookie";

/**
 * 1. Determine Base URL
 * Looks into the .env file for VITE_API_URL
 */
const getBaseUrl = () => {
  // Priority 1: Use the Environment Variable (this works for both local and Vercel)
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl) {
    return envUrl;
  }

  // Priority 2: Fallback for Local Development if .env is missing
  if (import.meta.env.DEV) {
    console.warn("⚠️ VITE_API_URL is missing in .env. Defaulting to localhost:5000");
    return "http://localhost:5000/api";
  }

  // Final Fallback: Root relative path (only used if nothing else is defined)
  return "";
};

export const API_BASE_URL = getBaseUrl();

/**
 * 2. Auth Token Helper
 */
export const getAuthToken = () => Cookies.get("authToken") || null;

/**
 * 3. Common Headers
 * Automatically attaches the Bearer token for secured routes
 */
export const getHeaders = (requiresAuth = true) => {
  const headers = {
    "Accept": "application/json",
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};