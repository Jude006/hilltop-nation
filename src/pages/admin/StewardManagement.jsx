import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, Unlock, Edit3, Plus, 
  XCircle, CheckCircle2, BookOpen, Video, Users, Radio,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { FaUserShield } from 'react-icons/fa';
import { apiRequest } from '../../lib/api';

const StewardManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [expandedMobile, setExpandedMobile] = useState(null);

  const [formData, setFormData] = useState({
    name: '', email: '', role: 'Steward', permissions: []
  });

  const availablePermissions = [
    { id: 'Sermons', icon: <BookOpen size={14} /> },
    { id: 'Media Assets', icon: <Video size={14} /> },
    { id: 'Membership', icon: <Users size={14} /> },
    { id: 'Communications', icon: <Radio size={14} /> }
  ];

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    try {
      const res = await apiRequest('/admin/workers', 'GET');
      setWorkers(res.workers || []);
    } catch (err) { console.error(err.message); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = selectedWorker ? `/admin/update/${selectedWorker._id}` : '/admin/create-worker';
      const method = selectedWorker ? 'PUT' : 'POST';
      await apiRequest(endpoint, method, formData);
      fetchWorkers();
      closeModal();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleStatusToggle = async (worker) => {
    const newStatus = worker.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await apiRequest(`/admin/status/${worker._id}`, 'PATCH', { status: newStatus });
      fetchWorkers();
    } catch (err) { alert(err.message); }
  };

  const togglePermission = (id) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id) 
        ? prev.permissions.filter(p => p !== id) 
        : [...prev.permissions, id]
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorker(null);
    setFormData({ name: '', email: '', role: 'Steward', permissions: [] });
  };

  const toggleMobileExpand = (id) => {
    setExpandedMobile(expandedMobile === id ? null : id);
  };

  return (
    <div className="p-4 space-y-6 md:p-8 md:space-y-8 font-albert-sans">
      
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-primary font-heading-serif">Steward Council</h2>
          <p className="text-[8px] md:text-[10px] text-primary/30 uppercase tracking-[0.4em] font-bold">Worker Access Control</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full md:w-auto bg-secondary text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 md:gap-3 hover:scale-105 transition-all"
        >
          <Plus size={16} className="md:w-[18px] md:h-[18px]" /> Create Steward Account
        </button>
      </div>

      {/* Stats - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
        <StatCard label="Total" val={workers.length} icon={<FaUserShield />} color="text-primary" />
        <StatCard label="Active" val={workers.filter(w => w.status === 'Active').length} icon={<ShieldCheck />} color="text-secondary" />
        <StatCard label="Suspended" val={workers.filter(w => w.status === 'Suspended').length} icon={<ShieldAlert />} color="text-red-500" />
      </div>

      {/* Workers Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {workers.map(worker => (
          <div 
            key={worker._id} 
            className="bg-white rounded-[30px] md:rounded-[40px] p-6 md:p-8 border border-gray-50 shadow-sm relative overflow-hidden group"
          >
            {worker.status === 'Suspended' && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <div className="bg-red-500 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                  <Lock size={10} className="md:w-3 md:h-3" /> Suspended
                </div>
              </div>
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-background rounded-2xl text-primary/20">
                <FaUserShield size={20} className="md:w-7 md:h-7" />
              </div>
              <div className="z-20 flex gap-1.5 md:gap-2">
                <button 
                  onClick={() => { setSelectedWorker(worker); setFormData(worker); setIsModalOpen(true); }} 
                  className="p-1.5 md:p-2 bg-background hover:bg-secondary hover:text-white rounded-lg md:rounded-xl transition-colors"
                >
                  <Edit3 size={12} className="md:w-[14px] md:h-[14px]" />
                </button>
                <button 
                  onClick={() => handleStatusToggle(worker)} 
                  className="p-1.5 md:p-2 bg-background hover:bg-accent hover:text-white rounded-lg md:rounded-xl transition-colors"
                >
                  {worker.status === 'Active' ? <Lock size={12} className="md:w-[14px] md:h-[14px]" /> : <Unlock size={12} className="md:w-[14px] md:h-[14px]" />}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="cursor-pointer md:cursor-default" onClick={() => toggleMobileExpand(worker._id)}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg md:text-xl font-black text-primary">{worker.name}</h4>
                  <p className="text-[10px] md:text-[11px] font-bold text-primary/30 truncate max-w-[180px] md:max-w-full">{worker.email}</p>
                </div>
                <div className="md:hidden">
                  {expandedMobile === worker._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </div>

            {/* Permissions - Always visible on desktop, toggle on mobile */}
            <div className={`${expandedMobile === worker._id ? 'block' : 'hidden md:block'} pt-3 md:pt-4 mt-3 md:mt-4 border-t border-gray-50`}>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {worker.permissions.length > 0 ? (
                  worker.permissions.map(p => (
                    <span key={p} className="px-2 md:px-3 py-0.5 md:py-1 bg-secondary/5 text-secondary text-[7px] md:text-[9px] font-black uppercase rounded-lg border border-secondary/10">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-[7px] md:text-[9px] text-primary/30 font-black uppercase">No permissions assigned</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL - Mobile Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-primary/40 backdrop-blur-md p-4 md:p-6">
          <div className="w-full max-w-2xl bg-white rounded-[30px] md:rounded-[50px] p-6 md:p-12 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in duration-300">
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <h3 className="text-2xl md:text-3xl font-black font-heading-serif">Steward Setup</h3>
              <button onClick={closeModal} className="p-2 md:p-3 bg-background rounded-2xl hover:text-red-500">
                <XCircle size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
              {/* Left Column - Mobile Full Width */}
              <div className="space-y-4 md:space-y-6">
                <InputGroup 
                  label="Name" 
                  value={formData.name} 
                  onChange={v => setFormData({...formData, name: v})} 
                />
                <InputGroup 
                  label="Email" 
                  type="email" 
                  value={formData.email} 
                  onChange={v => setFormData({...formData, email: v})} 
                />
                <InputGroup 
                  label="Role" 
                  value={formData.role} 
                  onChange={v => setFormData({...formData, role: v})} 
                />
              </div>

              {/* Permissions - Mobile Optimized */}
              <div className="space-y-3 md:space-y-4">
                <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/30">
                  Permissions
                </label>
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  {availablePermissions.map(perm => (
                    <button 
                      key={perm.id} 
                      type="button" 
                      onClick={() => togglePermission(perm.id)} 
                      className={`w-full flex justify-between items-center p-3 md:p-4 rounded-2xl border-2 transition-all ${
                        formData.permissions.includes(perm.id) 
                          ? 'border-secondary bg-secondary/5 text-secondary' 
                          : 'border-background text-primary/40'
                      }`}
                    >
                      <span className="flex items-center gap-2 md:gap-3 font-black text-[9px] md:text-[11px] uppercase tracking-widest">
                        {perm.icon} {perm.id}
                      </span>
                      {formData.permissions.includes(perm.id) && <CheckCircle2 size={14} className="md:w-4 md:h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:bg-secondary disabled:opacity-50 transition-all"
              >
                {loading ? 'Processing...' : 'Activate Steward'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card - Responsive
const StatCard = ({ label, val, icon, color }) => (
  <div className="bg-white p-4 md:p-8 rounded-[25px] md:rounded-[35px] border border-gray-50 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-primary/30 mb-0.5 md:mb-1">{label}</p>
      <h4 className={`text-2xl md:text-3xl font-black ${color}`}>{val}</h4>
    </div>
    <div className={`w-10 h-10 md:w-12 md:h-12 bg-background rounded-2xl flex items-center justify-center ${color} opacity-40`}>
      {icon}
    </div>
  </div>
);

// Input Group - Responsive
const InputGroup = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1 md:space-y-2">
    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">{label}</label>
    <input 
      required 
      type={type} 
      className="w-full px-4 md:px-6 py-3 md:py-4 font-bold border-none outline-none bg-background rounded-xl md:rounded-2xl text-sm md:text-base" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);

export default StewardManagement;