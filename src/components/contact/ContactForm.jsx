import React, { useState } from "react";
import { SendHorizontal, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "../../lib/api";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await apiRequest("/contact", "POST", formData, false);
      console.log("Contact form submitted:", response);
      setStatus("success");
      setFormData({
        fullName: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="mb-10">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondaryLight mb-2 font-Montserrat">
          // Send a message
        </h3>
        <h2 className="text-4xl font-heading-sans tracking-tighter text-primary uppercase">
          How can we <span className="text-gray-300">Help?</span>
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">
              Full Name
            </label>
            <input
              required
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Your full name"
              className="w-full bg-[#f9f9f9] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-secondaryLight/20 transition-all outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">
              Email Address
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your.email@example.com"
              className="w-full bg-[#f9f9f9] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-secondaryLight/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">
            Subject
          </label>
          <select
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full bg-[#f9f9f9] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-secondaryLight/20 outline-none appearance-none"
          >
            <option>General Inquiry</option>
            <option>Prayer Request</option>
            <option>Testimony</option>
            <option>Membership</option>
            <option>Partnership</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">
            Message
          </label>
          <textarea
            required
            rows="5"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Write your message here..."
            className="w-full bg-[#f9f9f9] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-secondaryLight/20 outline-none resize-none"
          ></textarea>
        </div>

        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileTap={{ scale: 0.95 }}
          className={`group flex items-center justify-center gap-3 w-full md:w-auto px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl
            ${status === "success" ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-secondaryLight"}
          `}
        >
          {status === "loading" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : status === "success" ? (
            "Message Sent"
          ) : (
            "Send Message"
          )}

          {status === "idle" && (
            <SendHorizontal
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          )}
          {status === "success" && <CheckCircle2 size={16} />}
        </motion.button>

        {status === "error" && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;