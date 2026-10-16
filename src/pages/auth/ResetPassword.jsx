import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, Lock, KeyRound } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: initialEmail,
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      const response = await apiRequest(
        "/auth/reset-password-with-otp",
        "POST",
        {
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        },
      );

      if (response && response.user && response.token) {
        loginUser(response.user, response.token);

        // --- UNIFIED NAVIGATION ---
        // Everyone goes to the admin portal path now
        navigate("/HTN-admin/dashboard");
      } else {
        alert("Password updated! Please sign in.");
        navigate("/HTN-gate/login");
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 overflow-hidden font-sans bg-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/[0.03] border border-white/10 p-12 rounded-[40px] backdrop-blur-2xl z-10"
      >
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 border bg-white/5 border-white/10 rounded-2xl">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase">
            Security Verification
          </h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">
            Set your new access credentials
          </p>
        </div>

        <form
          onSubmit={handleReset}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">
              Activation Code
            </label>
            <input
              type="text"
              required
              maxLength="6"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-center text-2xl font-black tracking-[0.5em] focus:border-white outline-none"
              placeholder="000000"
              value={formData.otp}
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute text-gray-700 -translate-y-1/2 left-4 top-1/2"
                size={16}
              />
              <input
                type="password"
                required
                className="w-full py-4 pl-12 pr-4 text-sm text-white border outline-none bg-white/5 border-white/10 rounded-2xl focus:border-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">
              Confirm
            </label>
            <div className="relative">
              <KeyRound
                className="absolute text-gray-700 -translate-y-1/2 left-4 top-1/2"
                size={16}
              />
              <input
                type="password"
                required
                className="w-full py-4 pl-12 pr-4 text-sm text-white border outline-none bg-white/5 border-white/10 rounded-2xl focus:border-white"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="md:col-span-2 w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-[0.98] mt-4"
          >
            {loading ? "Updating Portal Access..." : "Finalize & Enter Portal"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
