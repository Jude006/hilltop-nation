import React, { useState, useEffect } from "react";
import {
  Send,
  Users,
  Zap,
  Info,
  CheckCircle2,
  Loader2,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiRequest } from "../../lib/api";

const Broadcast = () => {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showTags, setShowTags] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiRequest("/members", "GET", null, true);
        setMembers(data);
      } catch (err) {
        toast.error(err.message || "Failed to load members");
      }
    };
    fetchMembers();
  }, []);

  const handleAutoBroadcast = async () => {
    if (!message) return toast.error("Write a message first!");
    if (selectedMembers.length === 0)
      return toast.warning("Select recipients first");

    setIsSending(true);

    const totalSeconds = selectedMembers.length * 5;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const durationText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    const toastId = toast.loading("Connecting to HTN Engine...");

    try {
      const response = await apiRequest(
        "/comms/auto-broadcast",
        "POST",
        {
          members: selectedMembers,
          message: message,
        },
        true,
      );

      toast.update(toastId, {
        render: `🚀 Broadcast Started! Est. completion: ${durationText}. The server is handling this in the background.`,
        type: "success",
        isLoading: false,
        autoClose: 10000,
      });
      setMessage("");
      setSelectedMembers([]);
    } catch (err) {
      toast.update(toastId, {
        render:
          err.message ||
          "Engine Error: Ensure WhatsApp is linked in System Bridge.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-3 mx-auto space-y-4 md:p-8 md:space-y-8 max-w-7xl font-albert-sans">
      {/* Header - Mobile Optimized */}
      <header className="flex flex-col items-start justify-between gap-2 md:gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-primary font-heading-serif">
            Smart Broadcast
          </h2>
          <p className="text-[7px] md:text-[10px] text-primary/30 uppercase tracking-[0.4em] font-bold mt-0.5 md:mt-1">
            Automated Outreach Engine
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-6 md:py-3 bg-white border border-gray-100 shadow-sm rounded-xl md:rounded-2xl">
          <Users size={14} className="md:w-[18px] md:h-[18px] text-secondary" />
          <span className="text-[9px] md:text-xs font-black text-primary">
            {selectedMembers.length} Recipients
          </span>
        </div>
      </header>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 lg:gap-8">
        {/* COMPOSER AREA - Mobile Optimized */}
        <div className="lg:col-span-8 bg-white rounded-[24px] md:rounded-[50px] p-4 md:p-12 border border-gray-50 shadow-sm space-y-4 md:space-y-8">
          {/* Tags Row - Collapsible on Mobile */}
          <div>
            {/* Mobile Toggle */}
            <button
              onClick={() => setShowTags(!showTags)}
              className="flex items-center justify-between w-full md:hidden mb-2 p-2 bg-secondary/5 rounded-xl"
            >
              <span className="text-[8px] font-black text-primary/60 uppercase tracking-wider">
                Insert Tags
              </span>
              {showTags ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <div className={`${showTags ? "block" : "hidden md:block"}`}>
              <div className="flex flex-wrap gap-1.5 md:gap-2 p-2 md:p-4 border bg-secondary/5 rounded-xl md:rounded-3xl border-secondary/10">
                {["{name}", "{title}", "{dept}"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setMessage(message + tag)}
                    className="px-2.5 py-1 md:px-4 md:py-2 bg-white rounded-lg md:rounded-xl text-[7px] md:text-[10px] font-black text-primary/50 hover:text-secondary border border-gray-100 transition-all shadow-sm italic"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Textarea - Mobile Optimized */}
          <textarea
            className="w-full bg-background rounded-[20px] md:rounded-[35px] px-4 md:px-8 py-4 md:py-8 font-medium outline-none min-h-[150px] md:min-h-[400px] leading-relaxed border-2 border-transparent focus:border-secondary/10 text-primary text-sm md:text-lg"
            placeholder="Hello {name}, greetings from Hilltop Nation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Buttons & Info - Mobile Optimized */}
          <div className="space-y-3 md:space-y-4">
            <button
              onClick={handleAutoBroadcast}
              disabled={isSending || selectedMembers.length === 0}
              className="w-full bg-secondary text-white py-4 md:py-6 rounded-[20px] md:rounded-[28px] font-black uppercase tracking-[0.15em] md:tracking-[0.3em] text-[9px] md:text-[11px] shadow-2xl flex items-center justify-center gap-2 md:gap-4 disabled:opacity-30 hover:bg-primary transition-all active:scale-95"
            >
              {isSending ? (
                <Loader2
                  className="animate-spin md:w-[18px] md:h-[18px]"
                  size={16}
                />
              ) : (
                <Send size={16} className="md:w-[18px] md:h-[18px]" />
              )}
              <span className="hidden xs:inline">
                Execute Background Broadcast
              </span>
              <span className="xs:hidden">Broadcast</span>
            </button>

            <div className="flex items-start gap-2 md:gap-4 p-3 md:p-6 border bg-primary/5 rounded-xl md:rounded-3xl border-primary/5">
              <Clock
                className="text-primary/40 shrink-0 mt-0.5 md:w-5 md:h-5"
                size={14}
              />
              <p className="text-[7px] md:text-[10px] text-primary/60 leading-relaxed font-bold uppercase tracking-tight">
                {selectedMembers.length > 0 ? (
                  <>
                    SERVER PROTOCOL: {selectedMembers.length} members • ~
                    {Math.ceil((selectedMembers.length * 5) / 60)} min
                  </>
                ) : (
                  <>SERVER PROTOCOL: Select recipients to estimate time</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* RECIPIENT SELECTOR - Mobile Optimized */}
        <div className="lg:col-span-4 bg-white rounded-[24px] md:rounded-[45px] p-4 md:p-8 border border-gray-50 flex flex-col h-[300px] md:h-[800px] shadow-sm">
          <div className="flex items-center justify-between px-1 md:px-2 mb-3 md:mb-6">
            <h4 className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-primary/30">
              Members ({members.length})
            </h4>
            <button
              onClick={() => setSelectedMembers(members)}
              className="text-[7px] md:text-[9px] font-black text-secondary uppercase hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="flex-1 pr-0.5 md:pr-2 space-y-1.5 md:space-y-3 overflow-y-auto custom-scrollbar">
            {members.map((member) => {
              const isSelected = selectedMembers.find(
                (m) => m._id === member._id,
              );
              return (
                <div
                  key={member._id}
                  onClick={() =>
                    isSelected
                      ? setSelectedMembers(
                          selectedMembers.filter((m) => m._id !== member._id),
                        )
                      : setSelectedMembers([...selectedMembers, member])
                  }
                  className={`p-2 md:p-4 rounded-xl md:rounded-3xl border cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected
                      ? "border-secondary bg-secondary/5 shadow-inner"
                      : "border-gray-50 hover:bg-background"
                  }`}
                >
                  <div className="flex items-center gap-1.5 md:gap-3 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-[7px] md:text-[10px] font-black transition-all flex-shrink-0 ${
                        isSelected
                          ? "bg-secondary text-white"
                          : "bg-background text-primary/30"
                      }`}
                    >
                      {member.name ? member.name.charAt(0) : "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] md:text-[11px] font-black text-primary transition-colors truncate">
                        {member.name}
                      </p>
                      <p className="text-[6px] md:text-[9px] font-bold text-primary/20 uppercase tracking-tighter truncate">
                        {member.dept || "Member"}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2
                      size={12}
                      className="md:w-4 md:h-4 text-secondary flex-shrink-0 animate-in zoom-in"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Stats */}
          <div className="pt-2 mt-2 border-t border-gray-100 md:hidden">
            <p className="text-[7px] text-primary/30 font-black uppercase tracking-wider text-center">
              {selectedMembers.length} of {members.length} selected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
