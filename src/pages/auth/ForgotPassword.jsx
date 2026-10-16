import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { CheckCircle2, ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // This hits your backend to generate and mail the 6-digit OTP
      await apiRequest("/auth/forgot-password", "POST", { email });
      setIsSuccess(true);

      // Auto-move to reset page after 2 seconds so they can enter the code
      setTimeout(() => {
        navigate(`/HTN-gate/reset-password?email=${email}`);
      }, 2500);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 overflow-hidden font-sans bg-black">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/[0.03] border border-white/10 p-10 rounded-[32px] backdrop-blur-xl z-10 relative"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 mb-8 text-gray-500 transition-colors hover:text-white group"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Back to Login
                </span>
              </button>

              <h2 className="mb-2 text-3xl font-black tracking-tighter text-white uppercase">
                Recover Access
              </h2>
              <p className="text-gray-500 text-[11px] uppercase tracking-[0.2em] mb-10 leading-relaxed">
                Enter your registered email to receive a 6-digit activation
                code.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1 font-bold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2"
                      size={16}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-4 pl-12 pr-4 text-white transition-all border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-white placeholder:text-gray-800"
                      placeholder="steward@HTN.org"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-[0.98] shadow-xl disabled:opacity-50"
                >
                  {loading ? "Sending Code..." : "Get Security Code"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center"
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 border rounded-full bg-green-500/10 border-green-500/20">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h3 className="mb-2 text-xl font-black tracking-tight text-white uppercase">
                Code Sent!
              </h3>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">
                Check your inbox. We are redirecting you to the verification
                screen.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
