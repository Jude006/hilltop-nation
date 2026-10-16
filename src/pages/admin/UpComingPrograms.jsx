import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  Plus,
  Image as ImageIcon,
  Loader2,
  Upload,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiRequest, apiRequestMultipart } from "../../lib/api";

const BASE_URL = "http://localhost:5000";

const UpComingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });
  const [expandedMobile, setExpandedMobile] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/programs", "GET", null, true);
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load programs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("location", formData.location);
    data.append("description", formData.description || "");
    if (file) data.append("flier", file);

    try {
      if (editingId) {
        const response = await apiRequestMultipart(
          `/programs/${editingId}`,
          "PUT",
          data,
          true,
        );
        console.log("Update response:", response);
        toast.success("Program updated successfully");
      } else {
        await apiRequestMultipart("/programs", "POST", data, true);
        toast.success("Program published successfully");
      }

      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
      });
      setFile(null);
      setEditingId(null);
      fetchPrograms();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Operation failed");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    const formattedDate = p.date
      ? new Date(p.date).toISOString().split("T")[0]
      : "";
    setFormData({
      title: p.title,
      date: formattedDate,
      time: p.time,
      location: p.location,
      description: p.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await apiRequest(`/programs/${id}`, "DELETE", null, true);
        toast.info("Program deleted");
        fetchPrograms();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const toggleMobileExpand = (id) => {
    setExpandedMobile(expandedMobile === id ? null : id);
  };

  return (
    <div className="p-4 bg-[#f8fafc] min-h-screen md:p-8 font-albert-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header - Responsive */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#002a5c] italic uppercase">
              Program Manager
            </h1>
            <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Hilltop Nation
            </p>
          </div>
          <button
            onClick={fetchPrograms}
            className="p-2 transition-all rounded-full hover:bg-white"
          >
            <RefreshCcw size={18} className="md:w-5 md:h-5 text-gray-400" />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12">
          {/* FORM PANEL - Responsive */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-5 md:p-8 rounded-[28px] md:rounded-[32px] shadow-xl border border-gray-100 sticky top-4 md:top-8"
            >
              <h2 className="text-[10px] md:text-[11px] font-black uppercase text-[#002a5c] mb-4 md:mb-6 flex items-center gap-2">
                <Plus size={14} className="md:w-4 md:h-4 text-[#a26be6]" />
                {editingId ? "Edit Program" : "New Program"}
              </h2>

              <div className="space-y-3 md:space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>

                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />

                {/* FILE UPLOAD BOX - Responsive (Functionality unchanged) */}
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase ml-1">
                    Flier Image
                  </label>
                  <label className="relative flex flex-col items-center justify-center w-full h-24 md:h-32 overflow-hidden transition-all border-2 border-gray-100 border-dashed cursor-pointer rounded-2xl hover:bg-gray-50">
                    {file ? (
                      <div className="p-2 text-center">
                        <ImageIcon
                          className="mx-auto text-[#a26be6] mb-0.5 md:mb-1 md:w-5 md:h-5"
                          size={16}
                        />
                        <p className="text-[8px] md:text-[10px] font-bold text-[#002a5c] truncate px-2 md:px-4">
                          {file.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-4 pb-5 md:pt-5 md:pb-6 text-gray-300">
                        <Upload
                          size={18}
                          className="md:w-6 md:h-6 mb-1 md:mb-2"
                        />
                        <p className="text-[8px] md:text-[9px] font-black uppercase">
                          Click to upload flier
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                      accept="image/*"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 md:py-4 bg-[#a26be6] text-white rounded-2xl font-black uppercase text-[9px] md:text-[10px] shadow-lg hover:bg-[#002a5c] transition-all mt-3 md:mt-4"
                >
                  {editingId ? "Update Program" : "Publish Program"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        title: "",
                        date: "",
                        time: "",
                        location: "",
                        description: "",
                      });
                      setFile(null);
                    }}
                    className="w-full text-red-400 font-black uppercase text-[8px] md:text-[9px] mt-1 md:mt-2"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* LIST PANEL - Responsive */}
          <div className="space-y-3 md:space-y-4 lg:col-span-8">
            {loading ? (
              <div className="flex justify-center py-20 ">
                <Loader2
                  className="text-gray-300 animate-spin md:w-10 md:h-10"
                  size={32}
                />
              </div>
            ) : programs.length > 0 ? (
              programs.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-5 shadow-sm border border-gray-50 hover:shadow-md transition-all"
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center gap-6 group">
                    {/* Image - Functionality unchanged */}
                    <div className="flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-100 border-2 border-white shadow-sm rounded-2xl">
                      {p.flierUrl ? (
                        <img
                          src={`${BASE_URL}${p.flierUrl}`}
                          alt="flier"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-200">
                          <ImageIcon size={28} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-black text-[#002a5c] uppercase italic leading-none mb-3">
                        {p.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#a26be6]" />{" "}
                          {new Date(p.date).toDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[#a26be6]" />{" "}
                          {p.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#a26be6]" />{" "}
                          {p.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pr-4 transition-all opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-3 text-blue-500 transition-all bg-blue-50 rounded-xl hover:bg-blue-500 hover:text-white"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-3 text-red-500 transition-all bg-red-50 rounded-xl hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout - Image fully preserved */}
                  <div className="md:hidden">
                    <div className="flex items-start gap-3">
                      {/* Image - Functionality unchanged */}
                      <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 border-2 border-white shadow-sm rounded-xl">
                        {p.flierUrl ? (
                          <img
                            src={`${BASE_URL}${p.flierUrl}`}
                            alt="flier"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-200">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-black text-[#002a5c] uppercase italic leading-tight truncate">
                          {p.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} className="text-[#a26be6]" />{" "}
                            {new Date(p.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} className="text-[#a26be6]" />{" "}
                            {p.time}
                          </span>
                        </div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="text-[#a26be6]" />{" "}
                          {p.location}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleMobileExpand(p._id)}
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-[#002a5c]"
                      >
                        {expandedMobile === p._id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>

                    {/* Mobile Expanded Actions */}
                    {expandedMobile === p._id && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleEdit(p)}
                          className="flex-1 py-2.5 text-xs font-black text-blue-500 transition-all bg-blue-50 rounded-xl hover:bg-blue-500 hover:text-white flex items-center justify-center gap-1.5"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="flex-1 py-2.5 text-xs font-black text-red-500 transition-all bg-red-50 rounded-xl hover:bg-red-500 hover:text-white flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 md:py-20 text-center text-gray-300 font-black uppercase text-[10px] md:text-xs border-4 border-dashed border-gray-50 rounded-[30px] md:rounded-[40px]">
                No programs found. Start by creating one.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Input Component - Responsive only (functionality unchanged)
const Input = ({ label, ...props }) => (
  <div className="space-y-0.5 md:space-y-1">
    <label className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase ml-1 tracking-widest">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-2.5 md:p-3.5 bg-gray-50 border-none rounded-lg md:rounded-xl text-xs font-bold text-[#002a5c] focus:ring-4 focus:ring-[#a26be6]/5 outline-none transition-all"
    />
  </div>
);

export default UpComingPrograms;
