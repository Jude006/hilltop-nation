import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";
import { Lock, Mail, ChevronRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        "/auth/login",
        "POST",
        {
          email,
          password,
        },
        false,
      );

      // Ensure the backend actually sent the data before proceeding
      if (response && response.token && response.user) {
        const { token, user } = response;

        // 1. Save to AuthContext/LocalStorage
        loginUser(user, token);

        // 2. Immediate redirect based on role
        const userRole = user.role.toLowerCase();
        if (userRole === "admin") {
          navigate("/HTN-admin/dashboard");
        } else {
          navigate("/HTN-admin/dashboard");
        }
      } else {
        throw new Error("Invalid server response. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 overflow-hidden font-sans bg-black">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/[0.03] border border-white/10 p-10 rounded-[32px] backdrop-blur-xl z-10 relative"
      >
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 overflow-hidden border bg-white/5 border-white/10 rounded-2xl">
            <img
              src="/img/logo.jpeg"
              alt="Logo"
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase">
            Portal Access
          </h2>
          <p className="text-gray-500 text-[9px] mt-2 uppercase tracking-[0.4em] font-bold">
            Hilltop Nation
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1 font-black">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute text-gray-700 -translate-y-1/2 left-4 top-1/2"
                size={16}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-sm text-white transition-all border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-white placeholder:text-gray-800"
                placeholder="admin@HTN.org"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate("/HTN-gate/forgot-password")}
                className="text-[9px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest font-black"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock
                className="absolute text-gray-700 -translate-y-1/2 left-4 top-1/2"
                size={16}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-sm text-white transition-all border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-white placeholder:text-gray-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all active:scale-[0.98] mt-4 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? "Verifying Identity..." : "Enter Secure Portal"}
            {!loading && (
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            )}
          </button>
        </form>

        <div className="pt-8 mt-10 space-y-4 text-center border-t border-white/5">
          <button
            onClick={() => navigate("/")}
            className="text-[10px] text-gray-600 hover:text-white transition-all uppercase tracking-widest font-black flex items-center justify-center gap-2 mx-auto"
          >
            Back to Public Site
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
