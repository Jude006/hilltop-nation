import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Calendar,
  ChevronLeft,
  Upload,
  Trash2,
  Camera,
  Loader2,
  X,
  Image as ImageIcon,
  HardDrive,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiRequest } from "../../lib/api";
import { API_BASE_URL, getAuthToken } from "../../lib/config";

const MediaAssets = () => {
  const [view, setView] = useState("folders");
  const [galleries, setGalleries] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadData, setUploadData] = useState({
    title: "",
    date: "",
    category: "Sunday Service",
  });
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/media", "GET");
      setGalleries(res);
    } catch (err) {
      toast.error("Vault Synchronization Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    toast.success(`${newFiles.length} assets added to staging`);
  };

  const removeStagedImage = (id, url) => {
    URL.revokeObjectURL(url);
    setPreviews((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (previews.length === 0)
      return toast.warning("The staging area is empty.");

    setLoading(true);
    const deployToast = toast.loading("Securing assets in the cloud...");

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("category", uploadData.category);
    formData.append("date", uploadData.date);
    previews.forEach((p) => formData.append("images", p.file));

    try {
      const token = getAuthToken();
      const res = await axios.post(`${API_BASE_URL}/media/deploy`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      toast.update(deployToast, {
        render: "Archive Secured Successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setGalleries([res.data, ...galleries]);
      setPreviews([]);
      setUploadProgress(0);
      setView("folders");
    } catch (err) {
      toast.update(deployToast, {
        render: "Deployment Interrupted.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurgeAsset = async (folderId, assetId) => {
    if (!window.confirm("Permanently purge this asset from the sanctuary?"))
      return;

    const purgeToast = toast.loading("Purging asset...");
    try {
      const res = await apiRequest(
        `/media/${folderId}/asset/${assetId}`,
        "DELETE",
      );

      toast.update(purgeToast, {
        render: "Asset Purged Successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Refresh galleries to update cover images
      await fetchGalleries();

      // Update selected folder too
      if (selectedFolder && selectedFolder._id === folderId) {
        const updatedGalleries = await apiRequest("/media", "GET");
        const updatedFolder = updatedGalleries.find((g) => g._id === folderId);
        setSelectedFolder(updatedFolder);
      }
    } catch (err) {
      toast.update(purgeToast, {
        render: "Purge Failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (loading && view === "folders")
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
        <Loader2
          className="animate-spin text-secondary md:w-12 md:h-12"
          size={40}
        />
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary/30">
          Opening Vault...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen px-4 pb-20 font-albert-sans md:px-10 bg-background/30">
      {/* Header - Responsive */}
      <header className="flex flex-col items-start justify-between gap-4 py-6 mx-auto max-w-7xl md:py-10 md:flex-row md:items-center md:gap-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-[16px] md:rounded-[18px] flex items-center justify-center text-white shadow-xl">
            <Camera size={18} className="md:w-[22px] md:h-[22px]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase md:text-2xl text-primary">
              Media Vault
            </h1>
            <p className="text-[8px] md:text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em]">
              Visual Legacy Control
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 shadow-sm md:gap-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl">
          <HardDrive size={14} className="md:w-4 md:h-4 text-secondary" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-secondary">
            {galleries.length} Archives Locked
          </span>
        </div>
      </header>

      {/* FOLDERS VIEW */}
      {view === "folders" && (
        <div className="mx-auto space-y-6 duration-500 max-w-7xl md:space-y-10 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl text-primary font-heading-serif">
                Sanctuary Archives
              </h2>
              <p className="mt-1 text-xs font-medium text-primary/40 md:text-sm">
                Managing the visual history of HTN.
              </p>
            </div>
            <button
              onClick={() => setView("upload")}
              className="w-full md:w-auto bg-secondary text-white px-6 md:px-10 py-4 md:py-5 rounded-[20px] md:rounded-[22px] text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 md:gap-3 hover:-translate-y-1 transition-all active:scale-95"
            >
              <Plus size={16} className="md:w-[18px] md:h-[18px]" /> Archive New
              Assets
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-8">
            {galleries.map((folder) => (
              <div
                key={folder._id}
                onClick={() => {
                  setSelectedFolder(folder);
                  setView("details");
                }}
                className="group cursor-pointer bg-white p-3 md:p-4 rounded-[28px] md:rounded-[40px] border border-gray-50 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-[4/5] rounded-[24px] md:rounded-[32px] overflow-hidden mb-3 md:mb-6 bg-background">
                  <img
                    src={folder.coverImage}
                    alt=""
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-white/90 backdrop-blur-md px-2 md:px-4 py-0.5 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest text-secondary shadow-sm">
                    {folder.category}
                  </div>
                </div>
                <div className="px-1 pb-1 md:px-2 md:pb-2">
                  <h4 className="text-base font-black tracking-tight truncate md:text-xl text-primary">
                    {folder.title}
                  </h4>
                  <p className="text-[8px] md:text-[10px] font-bold text-primary/30 uppercase tracking-widest flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
                    <Calendar size={10} className="md:w-3 md:h-3" />{" "}
                    {new Date(folder.date).toLocaleDateString()} •{" "}
                    {folder.images?.length} Items
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD VIEW - Responsive */}
      {view === "upload" && (
        <div className="max-w-4xl pt-6 mx-auto duration-700 md:pt-10 animate-in slide-in-from-bottom-12">
          <button
            onClick={() => setView("folders")}
            className="flex items-center gap-2 mb-6 transition-all md:gap-3 md:mb-10 text-primary/30 hover:text-secondary group"
          >
            <div className="p-2 transition-all bg-white border border-gray-100 shadow-sm md:p-3 rounded-xl md:rounded-2xl group-hover:bg-secondary group-hover:text-white">
              <ChevronLeft size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">
              Cancel Archiving
            </span>
          </button>

          <div className="bg-white p-6 md:p-16 rounded-[30px] md:rounded-[50px] shadow-2xl border border-gray-50">
            <form onSubmit={handleDeploy} className="space-y-6 md:space-y-10">
              <h2 className="text-3xl font-black tracking-tight md:text-4xl text-primary font-heading-serif">
                New Archive
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase text-primary/30 ml-2 md:ml-4">
                    Archive Title
                  </label>
                  <input
                    type="text"
                    placeholder="Service Name"
                    required
                    className="w-full bg-background/50 border-none rounded-[16px] md:rounded-[20px] px-4 md:px-8 py-4 md:py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/10"
                    onChange={(e) =>
                      setUploadData({ ...uploadData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase text-primary/30 ml-2 md:ml-4">
                    Archive Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full bg-background/50 border-none rounded-[16px] md:rounded-[20px] px-4 md:px-8 py-4 md:py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/10"
                    onChange={(e) =>
                      setUploadData({ ...uploadData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div
                onClick={() => fileInputRef.current.click()}
                className="border-4 border-dashed border-background bg-background/20 rounded-[30px] md:rounded-[40px] py-10 md:py-16 px-4 text-center hover:border-secondary/20 hover:bg-background/40 cursor-pointer transition-all group"
              >
                <input
                  type="file"
                  multiple
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFiles}
                />
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-[20px] md:rounded-[22px] flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Upload className="text-secondary md:w-7 md:h-7" size={24} />
                </div>
                <p className="text-base font-black tracking-tight md:text-lg text-primary">
                  Tap to Upload Assets
                </p>
                <p className="text-primary/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-2">
                  Maximum 100 images per archive
                </p>
              </div>

              {previews.length > 0 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-2 md:px-4">
                    <h3 className="font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                      <ImageIcon
                        size={12}
                        className="md:w-[14px] md:h-[14px]"
                      />{" "}
                      Staging Vault ({previews.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setPreviews([])}
                      className="text-red-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex gap-3 pb-4 overflow-x-auto md:gap-4 md:pb-6 scrollbar-hide snap-x">
                    {previews.map((item) => (
                      <div
                        key={item.id}
                        className="relative flex-shrink-0 w-28 md:w-40 aspect-[3/4] rounded-[20px] md:rounded-[24px] overflow-hidden shadow-xl border-2 border-white"
                      >
                        <img
                          src={item.url}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeStagedImage(item.id, item.url);
                          }}
                          className="absolute top-1.5 md:top-2 right-1.5 md:right-2 bg-white/90 text-red-500 p-1.5 md:p-2 rounded-full shadow-lg"
                        >
                          <X size={12} className="md:w-[14px] md:h-[14px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 md:space-y-4">
                {loading && (
                  <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all bg-secondary"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                <button
                  disabled={loading || previews.length === 0}
                  className="w-full py-5 md:py-6 bg-secondary text-white rounded-[22px] md:rounded-[25px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[11px] shadow-2xl hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 md:gap-3"
                >
                  {loading ? (
                    <Loader2
                      className="animate-spin md:w-[18px] md:h-[18px]"
                      size={16}
                    />
                  ) : (
                    <CheckCircle2
                      size={16}
                      className="md:w-[18px] md:h-[18px]"
                    />
                  )}
                  {loading
                    ? `Securing Archive ${uploadProgress}%`
                    : "Finalize & Deploy to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS VIEW - Responsive */}
      {view === "details" && selectedFolder && (
        <div className="pt-6 mx-auto duration-500 max-w-7xl md:pt-10 animate-in fade-in">
          <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center md:mb-16 md:gap-6">
            <button
              onClick={() => setView("folders")}
              className="flex items-center gap-2 transition-all md:gap-3 text-primary/30 hover:text-secondary group"
            >
              <div className="p-2 transition-all bg-white border border-gray-100 shadow-sm md:p-3 rounded-xl md:rounded-2xl group-hover:bg-secondary group-hover:text-white">
                <ChevronLeft size={16} className="md:w-[18px] md:h-[18px]" />
              </div>
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">
                Back to Archives
              </span>
            </button>
            <div className="w-full text-left md:text-right md:w-auto">
              <h2 className="text-3xl font-black tracking-tighter md:text-5xl text-primary font-heading-serif">
                {selectedFolder.title}
              </h2>
              <p className="text-secondary font-black uppercase text-[9px] md:text-[10px] tracking-[0.4em] mt-1 md:mt-2">
                {new Date(selectedFolder.date).toDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-8">
            {selectedFolder.images.map((img) => (
              <div
                key={img._id}
                className="group relative aspect-[3/4] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-lg bg-white border border-gray-50"
              >
                <img
                  src={img.url}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                  <button
                    onClick={() =>
                      handlePurgeAsset(selectedFolder._id, img._id)
                    }
                    className="p-3 text-red-500 transition-all bg-white rounded-full shadow-2xl md:p-5 hover:bg-red-500 hover:text-white active:scale-90"
                  >
                    <Trash2 size={18} className="md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaAssets;
