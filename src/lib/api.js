import { API_BASE_URL, getHeaders } from "./config";
import Cookies from "js-cookie";

/**
 * Core API Wrapper for JSON requests
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {object|null} body - Request body
 * @param {boolean} requiresAuth - Whether authentication is required
 */
export const apiRequest = async (endpoint, method = "GET", body = null, requiresAuth = true) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      ...getHeaders(requiresAuth),
    },
  };

  // Only add Content-Type for JSON requests with a body
  // This allows public endpoints to work without forcing JSON headers
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    return await handleResponse(response, requiresAuth);
  } catch (error) { 
    console.error(`API Error [${method}] ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Specialized Wrapper for File Uploads (Multipart)
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {FormData} formData - Form data for file upload
 * @param {boolean} requiresAuth - Whether authentication is required
 */
export const apiRequestMultipart = async (endpoint, method = "POST", formData, requiresAuth = true) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method,
    headers: getHeaders(requiresAuth),
    body: formData, 
  };
  
  // Remove Content-Type header for multipart requests
  // The browser will set the correct boundary automatically
  if (options.headers['Content-Type']) {
    delete options.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, options);
    return await handleResponse(response, requiresAuth);
  } catch (error) {
    console.error(`Multipart Error [${method}] ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Shared Response Handler
 * Handles Security (401/403) and Error Parsing
 */
async function handleResponse(response, requiresAuth) {
  // 1. Handle Auth Failures (Unauthorized or Forbidden)
  if (response.status === 401 || response.status === 403) {
    if (requiresAuth && typeof window !== "undefined") {
      // MAXIMUM SECURITY CLEANUP:
      // Remove both the Token and the User Data to prevent state bugs
      localStorage.removeItem('raim_user');
      Cookies.remove("authToken");

      // Only redirect if we aren't already on the login page
      if (window.location.pathname !== "/HTN-gate/login") {
        window.location.href = "/HTN-gate/login";
      }
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw { 
        status: response.status, 
        message: errorData.message || "Access Denied / Session Expired" 
    };
  }

  // 2. Parse JSON - handle empty responses gracefully
  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  }

  // 3. Handle Logical Errors (400, 404, 500, etc.)
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || "Request failed");
    error.status = response.status;
    error.details = data?.errors || data?.validationErrors || null;
    throw error;
  }

  return data;
}