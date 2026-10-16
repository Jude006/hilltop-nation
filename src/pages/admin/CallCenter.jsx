import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  PhoneOff, Mic, MicOff, User, 
  Clock, Play, Square, ChevronLeft,
  Volume2, ShieldCheck, Info, 
  History, Search, CheckCircle2, Video, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
// Import your secure API wrapper
import { apiRequest } from '../../lib/api'; 

const CallCenter = () => {
  const navigate = useNavigate();
  
  // Member States
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Call States
  const [isCalling, setIsCalling] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callLogs, setCallLogs] = useState([]);
  const [callPurpose, setCallPurpose] = useState('Welfare Follow-up');

  // Load Members using secure API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/members', 'GET', null, true);
        setMembers(data);
      } catch (err) {
        toast.error(err.message || "Could not load members");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isCalling) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    if (!selectedMember) return toast.warning("Select a member first!");
    
    // Clean the phone number
    const cleanPhone = selectedMember.phone.replace(/\D/g, '');
    
    // Trigger the real phone call via system protocol
    window.open(`tel:${cleanPhone}`, '_self');
    
    setIsCalling(true);
    setSeconds(0);
    toast.info(`Calling ${selectedMember.name}...`);
  };

  const handleEndCall = async () => {
    const newLog = {
      memberName: selectedMember?.name || "Unknown",
      duration: formatTime(seconds),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      purpose: callPurpose,
      recorded: isRecording
    };

    // Optional: Log the call to the backend securely
    try {
        await apiRequest('/comms/log-call', 'POST', newLog, true);
    } catch (err) {
        console.error("Failed to save log to server");
    }

    setCallLogs(prev => [newLog, ...prev]);
    setIsCalling(false);
    setIsRecording(false);
    toast.success("Call Ended & Logged");
  };

  // Filter members by Name or Title
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 mx-auto space-y-8 duration-700 max-w-7xl animate-in fade-in font-albert-sans">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 transition-all text-primary/40 hover:text-secondary group">
          <div className="p-3 bg-white border border-gray-100 shadow-sm rounded-2xl group-hover:bg-secondary group-hover:text-white">
            <ChevronLeft size={18} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">Dashboard</span>
        </button>
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl">
          <div className={`w-2 h-2 rounded-full ${isCalling ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
            {isCalling ? 'Line Active' : 'Line Secured'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        
        {/* MEMBER DIRECTORY */}
        <div className="space-y-6 lg:col-span-3">
          <div className="bg-white rounded-[40px] p-6 border border-gray-50 shadow-sm flex flex-col h-[700px]">
             <div className="relative mb-6">
                <Search className="absolute -translate-y-1/2 left-4 top-1/2 text-primary/20" size={16} />
                <input 
                  className="w-full bg-background rounded-2xl py-4 pl-12 pr-4 text-[11px] font-bold outline-none border-2 border-transparent focus:border-secondary/10"
                  placeholder="Search Name or Title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className="flex-1 pr-2 space-y-2 overflow-y-auto custom-scrollbar">
                {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-secondary" /></div> : 
                  filteredMembers.map(m => (
                    <div 
                      key={m._id} 
                      onClick={() => !isCalling && setSelectedMember(m)}
                      className={`p-4 rounded-[25px] border transition-all cursor-pointer flex items-center justify-between ${selectedMember?._id === m._id ? 'border-secondary bg-secondary/5' : 'border-gray-50 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-[10px] font-black">{m.name.charAt(0)}</div>
                        <div>
                          <p className="text-[11px] font-black text-primary">{m.name}</p>
                          <p className="text-[9px] font-bold text-secondary uppercase">{m.title}</p>
                        </div>
                      </div>
                      {selectedMember?._id === m._id && <CheckCircle2 size={14} className="text-secondary" />}
                    </div>
                  ))
                }
             </div>
          </div>
        </div>

        {/* LIVE CALL INTERFACE */}
        <div className="space-y-6 lg:col-span-6">
          <div className={`rounded-[60px] p-12 text-center text-white relative overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-between transition-all duration-700 ${isCalling ? 'bg-red-600' : 'bg-secondary'}`}>
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 border rounded-full bg-white/5 backdrop-blur-xl border-white/10">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {isCalling ? "Live Voice Link" : "Ready to Connect"}
                   </span>
                </div>
                
                {selectedMember ? (
                  <div className="duration-500 animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-white/10 rounded-[30px] mx-auto flex items-center justify-center mb-4 backdrop-blur-md">
                        <User size={32} />
                    </div>
                    <h3 className="text-3xl font-black">{selectedMember.name}</h3>
                    <p className="text-white/60 font-bold uppercase text-[11px] tracking-widest">{selectedMember.phone}</p>
                  </div>
                ) : (
                  <p className="text-white/40 font-black uppercase text-[10px] py-10 tracking-widest">Please select a member</p>
                )}

                {isCalling && (
                  <div className="mt-8 space-y-2">
                    <span className="font-mono text-6xl font-black">{formatTime(seconds)}</span>
                    <div className="flex justify-center gap-1.5 h-4">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>)}
                    </div>
                  </div>
                )}
            </div>

            <div className="relative z-10">
                {isCalling && (
                  <div className="grid max-w-xs grid-cols-3 gap-4 mx-auto mb-10">
                      <ControlBtn active={isMuted} onClick={() => setIsMuted(!isMuted)} icon={isMuted ? <MicOff /> : <Mic />} label="Mute" />
                      <ControlBtn active={isSpeaker} onClick={() => setIsSpeaker(!isSpeaker)} icon={<Volume2 />} label="Speaker" />
                      <ControlBtn active={isRecording} onClick={() => setIsRecording(!isRecording)} icon={<Square className={isRecording ? 'fill-red-500 text-red-500' : ''} />} label="Rec" />
                  </div>
                )}

                <div className="flex flex-col items-center gap-6">
                    {!isCalling ? (
                      <div className="w-full max-w-sm space-y-4">
                        <select 
                          className="w-full px-6 py-4 text-sm font-bold text-white transition-all border outline-none bg-white/5 border-white/10 rounded-2xl"
                          value={callPurpose} onChange={(e) => setCallPurpose(e.target.value)}
                        >
                          <option className="text-black">Welfare Follow-up</option>
                          <option className="text-black">Counseling Session</option>
                          <option className="text-black">New Member Welcome</option>
                          <option className="text-black">Urgent Feedback</option>
                        </select>
                        <button 
                          onClick={handleStartCall}
                          disabled={!selectedMember}
                          className="w-full bg-white text-secondary py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl disabled:opacity-20 flex items-center justify-center gap-3"
                        >
                          <Play size={18} fill="currentColor" /> Start Voice Link
                        </button>
                      </div>
                    ) : (
                      <button onClick={handleEndCall} className="flex items-center justify-center w-20 h-20 text-red-600 transition-all bg-white rounded-full shadow-2xl hover:scale-110">
                        <PhoneOff size={32} />
                      </button>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* RECENT LOGS */}
        <div className="space-y-6 lg:col-span-3">
           <div className="bg-white rounded-[40px] p-8 border border-gray-50 shadow-sm h-[700px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                  <History size={18} className="text-primary/20" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Recent Logs</h4>
              </div>
              <div className="flex-1 pr-2 space-y-4 overflow-y-auto custom-scrollbar">
                {callLogs.length === 0 ? (
                    <div className="py-10 text-center text-primary/10">No calls logged yet</div>
                ) : (
                    callLogs.map((log, index) => (
                      <div key={index} className="p-4 border bg-background rounded-2xl border-gray-50">
                        <p className="text-[10px] font-black text-primary truncate">{log.memberName}</p>
                        <p className="text-[9px] font-bold text-secondary mb-2">{log.purpose}</p>
                        <div className="flex justify-between items-center text-[9px] font-bold text-primary/30">
                          <span>{log.duration}</span>
                          <span>{log.date}</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ControlBtn = ({ icon, label, onClick, active }) => (
  <div className="flex flex-col items-center gap-2">
    <button onClick={onClick} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-white text-secondary' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
      {React.cloneElement(icon, { size: 18 })}
    </button>
    <span className="text-[8px] font-black uppercase text-white/50">{label}</span>
  </div>
);

export default CallCenter;