import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Search, Trash2, ChevronLeft, Edit3,
  CheckCircle2, Play, CloudUpload, 
  Layers, Loader2, X
} from 'lucide-react';
import { apiRequest, apiRequestMultipart } from '../../lib/api';

// --- Helper: Format URL for Iframe ---
const getEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
  if (url.includes('facebook.com')) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
  if (url.includes('tiktok.com')) {
    const match = url.match(/\/video\/(\d+)/);
    if (match && match[1]) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }
  return url; 
};

// --- Video Popup Component ---
const VideoModal = ({ isOpen, onClose, sermon }) => {
  if (!isOpen || !sermon) return null;
  
  const videoUrl = sermon.videoUrl || sermon.link;
  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg|mov)$/) || videoUrl?.includes('cloudinary');
  const isTikTok = videoUrl?.includes('tiktok.com');

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-primary/95 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`relative w-full ${isTikTok ? 'max-w-[400px]' : 'max-w-5xl'} bg-black rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-95"
        >
          <X size={20} />
        </button>
        
        <div className={`${isTikTok ? 'aspect-[9/16]' : 'aspect-video'} w-full bg-black flex items-center justify-center`}>
          {isDirectVideo ? (
            <video controls autoPlay className="object-contain w-full h-full">
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <iframe 
              src={embedUrl}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={sermon.title}
            ></iframe>
          )}
        </div>
        
        <div className="p-6 md:p-8 bg-white max-h-[30vh] overflow-y-auto">
          <h3 className="text-xl font-black leading-tight tracking-tight uppercase md:text-2xl text-primary">
            {sermon.title}
          </h3>
          <p className="text-[11px] font-bold text-secondary uppercase tracking-[0.2em] mt-2 mb-3">
            {sermon.speaker} • {new Date(sermon.date).toLocaleDateString()}
          </p>
          <div className="h-[1px] w-12 bg-secondary/20 mb-3" />
          <p className="text-sm italic font-medium leading-relaxed text-primary/60">
            {sermon.desc || "No description available for this message."}
          </p>
        </div>
      </div>
    </div>
  );
};

const SermonLibrary = () => {
  const [view, setView] = useState('list');
  const [sermons, setSermons] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadType, setUploadType] = useState('link'); 
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '', speaker: '', date: '', link: '', desc: '', 
    category: 'Sunday Service', series: '', scriptures: '', cloudinaryId: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => { fetchSermons(); }, []);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/sermons", "GET");
      setSermons(res);
    } catch (err) {
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Upload to backend instead of Cloudinary directly
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return toast.error("Video exceeds 100MB limit. Please compress it first.");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      // Send to YOUR backend, not Cloudinary
      const res = await apiRequestMultipart("/sermons/upload-video", "POST", formData, true);
      
      setFormData(prev => ({ 
        ...prev, 
        link: res.secure_url, 
        cloudinaryId: res.public_id 
      }));
      toast.success("Video uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Video upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (sermon) => {
    setEditingId(sermon._id);
    setUploadType(sermon.uploadType || 'link');
    setFormData({
      title: sermon.title || '',
      speaker: sermon.speaker || '',
      date: sermon.date ? new Date(sermon.date).toISOString().split('T')[0] : '',
      link: sermon.videoUrl || sermon.link || '',
      desc: sermon.desc || '',
      category: sermon.category || 'Sunday Service',
      series: sermon.series || '',
      scriptures: sermon.scriptures || '',
      cloudinaryId: sermon.cloudinaryId || ''
    });
    setView('add');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (uploadType === 'file' && !formData.link) return toast.warning("Please upload a video file first.");

    const actionToast = toast.loading(editingId ? "Updating message..." : "Archiving message...");

    try {
      const payload = {
        ...formData,
        videoUrl: formData.link,
        uploadType,
        platform: uploadType === 'link' ? (formData.link.includes('tiktok') ? 'tiktok' : 'social') : 'internal'
      };

      if (editingId) {
        await apiRequest(`/sermons/${editingId}`, "PUT", payload);
        toast.update(actionToast, { render: "Sermon updated!", type: "success", isLoading: false, autoClose: 3000 });
      } else {
        await apiRequest("/sermons", "POST", payload);
        toast.update(actionToast, { render: "Sermon archived!", type: "success", isLoading: false, autoClose: 3000 });
      }

      setEditingId(null);
      setFormData({ title: '', speaker: '', date: '', link: '', desc: '', category: 'Sunday Service', series: '', scriptures: '', cloudinaryId: '' });
      setView('list');
      fetchSermons();
    } catch (err) {
      toast.update(actionToast, { render: "Operation failed.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sermon?")) return;
    try {
      await apiRequest(`/sermons/${id}`, "DELETE");
      toast.success("Removed from storehouse");
      fetchSermons();
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', speaker: '', date: '', link: '', desc: '', category: 'Sunday Service', series: '', scriptures: '', cloudinaryId: '' });
    setView('list');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Loader2 className="animate-spin text-secondary" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30">Syncing Sanctuary...</p>
    </div>
  );

  return (
    <div className="min-h-screen px-4 pb-20 font-albert-sans md:px-10">
      
      <VideoModal 
        isOpen={!!selectedSermon} 
        onClose={() => setSelectedSermon(null)}  
        sermon={selectedSermon}     
      />

      {view === 'list' ? (
        <div className="mx-auto space-y-8 duration-500 max-w-7xl animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col justify-between gap-6 pt-10 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-primary font-heading-serif">Digital Sanctuary</h2>
              <p className="text-[10px] text-primary/40 uppercase tracking-[0.4em] mt-1 font-bold">Secure Sermon Archive</p>
            </div>
            <button onClick={() => { setEditingId(null); setView('add'); }} className="bg-secondary text-white px-10 py-5 rounded-[22px] text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:-translate-y-1 transition-all active:scale-95">
              <CloudUpload size={18} /> Archive New Message
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="relative lg:col-span-2">
              <Search className="absolute -translate-y-1/2 left-5 top-1/2 text-primary/20" size={18} />
              <input type="text" placeholder="Search title..." className="w-full py-4 pr-4 text-sm font-medium border-none outline-none bg-background/50 rounded-2xl pl-14" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex items-center justify-center gap-2 py-4 border bg-secondary/5 rounded-2xl border-secondary/10 lg:py-0">
              <Layers size={16} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{sermons.length} Messages Locked</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {sermons.filter(s => s.title?.toLowerCase().includes(searchQuery.toLowerCase())).map((sermon) => (
              <div key={sermon._id} className="bg-white border border-gray-50 p-6 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center w-full gap-6 md:gap-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-background rounded-[25px] flex-shrink-0 flex items-center justify-center text-secondary border border-gray-100">
                    <Play size={24} className="fill-secondary/10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight md:text-xl text-primary line-clamp-1">{sermon.title}</h4>
                    <p className="text-[10px] font-bold uppercase text-primary/40 mt-1">{sermon.speaker} • {new Date(sermon.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center w-full gap-3 md:w-auto">
                    <button 
                      onClick={() => setSelectedSermon(sermon)}
                      className="flex-1 md:flex-none px-8 py-4 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all active:scale-95 whitespace-nowrap"
                    >
                      Watch
                    </button>
                    <button onClick={() => handleEditClick(sermon)} className="p-4 transition-colors rounded-full text-secondary hover:bg-secondary/10 bg-secondary/5 active:scale-90">
                        <Edit3 size={18}/>
                    </button>
                    <button onClick={() => handleDelete(sermon._id)} className="p-4 text-red-400 transition-colors rounded-full hover:text-red-600 bg-red-50 active:scale-90">
                        <Trash2 size={18}/>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl px-2 pt-10 mx-auto duration-700 animate-in slide-in-from-bottom-12">
          <button onClick={handleCancel} className="flex items-center gap-3 mb-10 transition-all text-primary/30 hover:text-secondary group">
            <div className="p-3 transition-all bg-white border border-gray-100 shadow-sm rounded-2xl group-hover:bg-secondary group-hover:text-white active:scale-90">
              <ChevronLeft size={18} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Cancel & Return</span>
          </button>

          <div className="bg-white border border-gray-50 rounded-[40px] md:rounded-[50px] p-6 md:p-16 shadow-2xl">
            <div className="flex flex-col items-start justify-between gap-8 mb-12 lg:flex-row">
              <div>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl text-primary font-heading-serif">
                    {editingId ? "Update Message" : "Preserve Message"}
                </h2>
                <p className="mt-2 text-xs font-bold tracking-widest uppercase text-primary/30">Archive the word for future generations.</p>
              </div>
              <div className="flex bg-background p-1.5 rounded-[22px] border border-gray-100 w-full lg:w-auto">
                <button type="button" onClick={() => setUploadType('link')} className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadType === 'link' ? 'bg-white shadow-md text-secondary' : 'text-primary/30'}`}>Social Link</button>
                <button type="button" onClick={() => setUploadType('file')} className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadType === 'file' ? 'bg-white shadow-md text-secondary' : 'text-primary/30'}`}>Internal Upload</button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
              {uploadType === 'file' && !editingId && (
                <div 
                  onClick={() => !uploading && fileInputRef.current.click()} 
                  className={`w-full border-4 border-dashed rounded-[30px] md:rounded-[40px] p-8 md:p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.link ? 'border-green-100 bg-green-50/30' : 'border-background bg-background/30 hover:border-secondary/20'}`}
                >
                  <input type="file" hidden ref={fileInputRef} accept="video/*" onChange={handleFileUpload} />
                  {uploading ? (
                    <Loader2 className="animate-spin text-secondary" size={40} />
                  ) : formData.link ? (
                    <CheckCircle2 className="text-green-500" size={40} />
                  ) : (
                    <CloudUpload className="text-secondary" size={40} />
                  )}
                  <h4 className="mt-4 text-[10px] font-black tracking-widest uppercase text-primary">
                    {uploading ? 'Uploading...' : formData.link ? 'Video Secured' : 'Select Video File'}
                  </h4>
                </div>
              )}

              {(uploadType === 'link' || (editingId && uploadType === 'file')) && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Video URL</label>
                    <input required className="w-full bg-background/50 border-none rounded-[20px] px-6 md:px-8 py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/10" placeholder="URL..." value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Title</label>
                    <input required className="w-full bg-background/50 border-none rounded-[20px] px-8 py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/10" placeholder="Message Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Speaker</label>
                    <input required className="w-full bg-background/50 border-none rounded-[20px] px-8 py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/10" placeholder="Minister Name" value={formData.speaker} onChange={(e) => setFormData({...formData, speaker: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Date</label>
                    <input type="date" required className="w-full bg-background/50 border-none rounded-[20px] px-8 py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/10" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Series</label>
                    <input className="w-full bg-background/50 border-none rounded-[20px] px-8 py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/10" placeholder="Series (Optional)" value={formData.series} onChange={(e) => setFormData({...formData, series: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Theological Description</label>
                <textarea rows="3" className="w-full bg-background/50 border-none rounded-[20px] px-8 py-5 text-sm font-bold outline-none resize-none focus:ring-2 focus:ring-secondary/10" placeholder="Brief summary..." value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} />
              </div>

              <button type="submit" disabled={uploading} className="w-full bg-secondary text-white py-6 rounded-[25px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                {uploading ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
                {editingId ? "Update Message" : "Archive Message"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonLibrary;