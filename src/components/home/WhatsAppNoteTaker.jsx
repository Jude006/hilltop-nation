import React, { useState, useEffect } from "react";
// Added 'Send' to the imports below to fix your error
import {
  BookOpen,
  MessageCircle,
  X,
  Loader2,
  CheckCircle,
  Send,
} from "lucide-react";
import { toast } from "react-toastify";

const WhatsAppNoteTaker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const userIsTyping = notes.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      // Make sure this ID matches exactly what you put in SermonSanctuary.jsx
      const sermonSection = document.getElementById("sermon-sanctuary");
      if (sermonSection) {
        const rect = sermonSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          if (!userIsTyping) setIsOpen(true);
        } else {
          if (!userIsTyping) setIsOpen(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userIsTyping]);

  const handleSendNotes = () => {
    if (!notes || !phone) {
      toast.warning("Please enter your notes and WhatsApp number");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSent(true);

      // Temporary WhatsApp Link for testing without backend
      const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent("📝 *My Sermon Notes:* \n\n" + notes)}`;
      window.open(whatsappUrl, "_blank");

      setTimeout(() => {
        setIsSent(false);
        setIsOpen(false);
        setNotes("");
        setPhone("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-albert-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-secondary text-white p-5 rounded-[24px] shadow-2xl hover:scale-110 hover:rotate-3 transition-all flex items-center gap-3 border-4 border-white group"
        >
          <div className="p-2 transition-colors rounded-lg bg-white/20 group-hover:bg-white/40">
            <BookOpen size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] pr-2">
            Scribe Mode
          </span>
        </button>
      )}

      {isOpen && (
        <div className="w-[380px] bg-white rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
          <div className="p-8 text-white bg-secondary">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">
                Digital Sanctuary Scribe
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 transition-transform rounded-full hover:rotate-90 bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-[10px] opacity-60 font-bold">
              Document what God is saying to you.
            </p>
          </div>

          <div className="p-8 space-y-5">
            {isSent ? (
              <div className="py-10 text-center animate-in fade-in zoom-in">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-green-600 bg-green-100 rounded-full">
                  <CheckCircle size={32} />
                </div>
                <h5 className="font-black text-secondary">Notes Synced!</h5>
                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">
                  Opening WhatsApp...
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <textarea
                    className="w-full h-48 bg-gray-50 rounded-[30px] p-6 text-[13px] font-medium text-primary outline-none border-2 border-transparent focus:border-secondary/20 transition-all resize-none custom-scrollbar"
                    placeholder="Start typing your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  {userIsTyping && (
                    <div className="absolute top-4 right-4 bg-secondary text-[8px] text-white px-2 py-1 rounded-full font-black animate-pulse">
                      ACTIVE SCRIBE
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Deliver to WhatsApp
                  </label>
                  <div className="relative">
                    <MessageCircle
                      className="absolute -translate-y-1/2 left-5 top-1/2 text-secondary"
                      size={16}
                    />
                    <input
                      className="w-full bg-gray-50 rounded-[20px] py-5 pl-12 pr-6 text-[12px] font-bold outline-none border-2 border-transparent focus:border-secondary/20 transition-all"
                      placeholder="Phone (e.g. +234...)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  onClick={handleSendNotes}
                  className="w-full bg-secondary text-white py-6 rounded-[25px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} /> Send Notes to Me
                    </>
                  )}
                </button>

                <p className="text-[8px] text-center text-gray-300 font-black uppercase tracking-tighter">
                  Powered by HTN Intelligence • No Login Required
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppNoteTaker;
