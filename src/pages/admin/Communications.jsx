import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Mail, MessageSquare, Search, CheckCircle2, Loader2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiRequest } from '../../lib/api'; 

const Communications = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [queue, setQueue] = useState([]);
  const [showTagHelp, setShowTagHelp] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest('/members', 'GET', null, true);
        setMembers(data);
      } catch (err) {
        toast.error(err.message || "Failed to load members");
      }
    };
    load();
    if (location.state?.directMember) {
      setSelectedMembers([location.state.directMember]);
    }
  }, [location]);

  const parseMessage = (text, member) => {
    return text
      .replace(/{name}/g, member.name || '')
      .replace(/{title}/g, member.title || '')
      .replace(/{dept}/g, member.dept || '');
  };

  const handleBulkExecute = async () => {
    if (!message) return toast.error("Write a message first!");
    if (selectedMembers.length === 0) return toast.warning("Select recipients first");

    if (activeTab === 'whatsapp') {
      setQueue([...selectedMembers]);
      toast.info(`Queue ready for ${selectedMembers.length} members. Use the 'Send Next' button below.`);
    } else {
      setIsSending(true);
      try {
        toast.loading("Sending Emails...", { toastId: 'mail' });
        await apiRequest('/comms/email', 'POST', {
          recipients: selectedMembers,
          subject: subject,
          message: message
        }, true);
        toast.update('mail', { render: "Broadcast Sent Successfully!", type: "success", isLoading: false, autoClose: 3000 });
      } catch (err) {
        toast.update('mail', { render: err.message || "Email Process Failed", type: "error", isLoading: false, autoClose: 3000 });
      } finally {
        setIsSending(false);
      }
    }
  };

  const sendNextWhatsApp = () => {
    if (queue.length === 0) return;

    const currentMember = queue[0];
    const cleanPhone = currentMember.phone.replace(/\D/g, '');
    const finalMsg = parseMessage(message, currentMember);

    const desktopUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(finalMsg)}`;
    window.open(desktopUrl, '_self');

    const remaining = queue.slice(1);
    setQueue(remaining);

    if (remaining.length === 0) {
      apiRequest('/comms/log-whatsapp', 'POST', {
        recipientNames: selectedMembers.map(m => m.name),
        message: message
      }, true).catch(err => console.error("Logging failed", err));
      
      toast.success("Outreach Sequence Completed!");
    }
  };

  return (
    <div className="p-4 mx-auto space-y-6 md:p-8 md:space-y-8 max-w-7xl font-albert-sans">
      
      {/* QUEUE MODAL / OVERLAY - Mobile Optimized */}
      {queue.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl border-4 border-secondary w-full max-w-md text-center space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="bg-secondary/10 text-secondary px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase">WhatsApp Queue</span>
              <button onClick={() => setQueue([])} className="hover:text-red-500 md:w-6 md:h-6"><XCircle className="text-gray-300" size={20}  /></button>
            </div>
            
            <div>
              <p className="text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest">Currently Sending To</p>
              <h3 className="mt-1 text-2xl md:text-3xl font-black text-primary">{queue[0].name}</h3>
              <p className="font-bold text-secondary text-sm md:text-base">{queue[0].phone}</p>
            </div>

            <button 
              onClick={sendNextWhatsApp}
              className="flex items-center justify-center w-full gap-2 md:gap-3 py-4 md:py-6 font-black tracking-widest text-white uppercase transition-transform shadow-xl bg-secondary rounded-2xl md:rounded-3xl hover:scale-105 text-xs md:text-base"
            >
              <MessageSquare size={16} className="md:w-5 md:h-5" /> Send Message ({queue.length} Left)
            </button>
            <p className="text-[8px] md:text-[10px] text-gray-400">Clicking will open your WhatsApp Desktop App</p>
          </div>
        </div>
      )}

      {/* Header - Mobile Optimized */}
      <header className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-primary font-heading-serif">Reach Out</h2>
          <p className="text-[8px] md:text-[10px] text-primary/30 uppercase tracking-[0.4em] font-bold mt-1">Multi-Channel Intelligence</p>
        </div>
        <div className="flex bg-white p-1 rounded-[18px] md:rounded-[22px] border border-gray-100 shadow-sm w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('whatsapp')} 
            className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'whatsapp' ? 'bg-secondary text-white shadow-lg' : 'text-primary/30'
            }`}
          >
            WhatsApp
          </button>
          <button 
            onClick={() => setActiveTab('email')} 
            className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'email' ? 'bg-primary text-white shadow-lg' : 'text-primary/30'
            }`}
          >
            Email
          </button>
        </div>
      </header>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        
        {/* Composer Area - Mobile Optimized */}
        <div className="lg:col-span-8 bg-white rounded-[30px] md:rounded-[50px] p-6 md:p-12 border border-gray-50 shadow-sm space-y-6 md:space-y-8">
          
          {/* Tags - Collapsible on Mobile */}
          <div>
            <button 
              onClick={() => setShowTagHelp(!showTagHelp)}
              className="flex items-center justify-between w-full md:hidden mb-3 p-3 bg-secondary/5 rounded-2xl"
            >
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-wider">Insert Tags</span>
              {showTagHelp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            <div className={`${showTagHelp ? 'block' : 'hidden md:block'}`}>
              <div className="flex flex-wrap gap-2 p-3 md:p-6 border bg-secondary/5 rounded-2xl md:rounded-3xl border-secondary/10">
                {['{name}', '{title}', '{dept}'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setMessage(message + tag)} 
                    className="px-3 md:px-3 py-1.5 md:py-1 bg-white rounded-lg text-[8px] md:text-[10px] font-bold text-primary/50 hover:text-secondary border border-gray-100 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email Subject - Mobile Optimized */}
          {activeTab === 'email' && (
            <input 
              className="w-full px-4 md:px-8 py-4 md:py-5 font-bold border-2 border-transparent outline-none bg-background rounded-xl md:rounded-2xl focus:border-primary/10 text-sm md:text-base" 
              placeholder="Email Subject" 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
            />
          )}

          {/* Textarea - Mobile Optimized */}
          <textarea 
            className="w-full bg-background rounded-[25px] md:rounded-[35px] px-6 md:px-8 py-6 md:py-8 font-medium outline-none min-h-[200px] md:min-h-[350px] leading-relaxed border-2 border-transparent focus:border-secondary/10 text-sm md:text-base" 
            placeholder="Type message..." 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
          />

          {/* Send Button - Mobile Optimized */}
          <button 
            onClick={handleBulkExecute} 
            disabled={isSending || selectedMembers.length === 0} 
            className="w-full bg-secondary text-white py-4 md:py-6 rounded-[24px] md:rounded-[28px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[11px] shadow-2xl flex items-center justify-center gap-3 md:gap-4 disabled:opacity-30 hover:bg-primary transition-all active:scale-95"
          >
            {isSending ? <Loader2  size={16} className="md:w-[18px] md:h-[18px] animate-spin" /> : <Send size={16} className="md:w-[18px] md:h-[18px]" />} 
            {activeTab === 'whatsapp' ? 'Start WhatsApp Queue' : 'Execute Email Outreach'}
          </button>
        </div>

        {/* RECIPIENT SELECTOR - Mobile Optimized */}
        <div className="lg:col-span-4 bg-white rounded-[30px] md:rounded-[45px] p-6 md:p-8 border border-gray-50 flex flex-col h-[400px] md:h-[750px] shadow-sm">
          <div className="flex items-center justify-between px-2 mb-4 md:mb-6">
            <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/30">
              Select Recipients ({selectedMembers.length})
            </h4>
            <button 
              onClick={() => setSelectedMembers(members)} 
              className="text-[8px] md:text-[9px] font-black text-secondary uppercase hover:underline"
            >
              Select All
            </button>
          </div>
          
          <div className="flex-1 pr-1 md:pr-2 space-y-2 md:space-y-3 overflow-y-auto custom-scrollbar">
            {members.map(member => {
              const isSelected = selectedMembers.find(m => m._id === member._id);
              return (
                <div 
                  key={member._id} 
                  onClick={() => isSelected 
                    ? setSelectedMembers(selectedMembers.filter(m => m._id !== member._id)) 
                    : setSelectedMembers([...selectedMembers, member])
                  } 
                  className={`p-3 md:p-4 rounded-2xl md:rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected ? 'border-secondary bg-secondary/5' : 'border-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-background rounded-lg md:rounded-xl flex items-center justify-center text-[8px] md:text-[10px] font-black flex-shrink-0">
                      {member.name ? member.name.charAt(0) : '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] md:text-[11px] font-black text-primary truncate">{member.name}</p>
                      <p className="text-[7px] md:text-[9px] font-bold text-primary/20 uppercase truncate">
                        {member.title} • {member.dept}
                      </p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={14} className="md:w-4 md:h-4 text-secondary flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Communications;