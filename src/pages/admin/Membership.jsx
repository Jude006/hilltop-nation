import React, { useState, useMemo, useEffect } from "react";
import {
  UserPlus,
  Search,
  Edit3,
  Trash2,
  X,
  MessageSquare,
  Loader2,
  Cake,
  Zap,
  ClipboardList,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../lib/api";

const Membership = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkData, setBulkData] = useState("");
  const [expandedMobile, setExpandedMobile] = useState(null);

  const initialFormState = {
    name: "",
    phone: "",
    email: "",
    dept: "Member",
    title: "Sir",
    gender: "Male",
    dob: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormState);

  const sanitizePhone = (phone) => {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "234" + clean.substring(1);
    } else if (!clean.startsWith("234")) {
      clean = "234" + clean;
    }
    return clean;
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/members", "GET", null, true);
      setMembers(data);
    } catch (err) {
      toast.error(err.message || "Could not load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery);
      const matchesDept = filterDept === "All" || m.dept === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [members, searchQuery, filterDept]);

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanData = { ...formData, phone: sanitizePhone(formData.phone) };

    try {
      if (selectedMember) {
        await apiRequest(
          `/members/${selectedMember._id}`,
          "PUT",
          cleanData,
          true,
        );
        toast.success("Profile Synchronized");
      } else {
        await apiRequest("/members", "POST", cleanData, true);
        toast.success(`${cleanData.title} ${cleanData.name} Registered!`);
      }
      fetchMembers();
      closeModal();
    } catch (err) {
      toast.error(err.message || "Operation Failed");
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkData.trim()) return toast.error("Paste data first!");
    const lines = bulkData.split("\n");
    let successCount = 0;

    toast.info(`Processing ${lines.length} entries...`);

    for (let line of lines) {
      const [title, name, phone, dept] = line.split(",").map((s) => s?.trim());
      if (!name || !phone) continue;

      try {
        await apiRequest(
          "/members",
          "POST",
          {
            title: title || "Sir",
            name,
            phone: sanitizePhone(phone),
            dept: dept || "Member",
            gender: "Male",
            email: `${phone}@HTN.com`,
          },
          true,
        );
        successCount++;
      } catch (err) {
        console.error(`Failed to register ${name}`);
      }
    }

    toast.success(`Power Upload Complete: ${successCount} members added.`);
    setBulkData("");
    setIsBulkOpen(false);
    fetchMembers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await apiRequest(`/members/${id}`, "DELETE", null, true);
      toast.info("Record Removed");
      fetchMembers();
    } catch (err) {
      toast.error(err.message || "Delete Failed");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsBulkOpen(false);
    setSelectedMember(null);
    setFormData(initialFormState);
  };

  const toggleMobileExpand = (id) => {
    setExpandedMobile(expandedMobile === id ? null : id);
  };

  return (
    <div className="p-4 space-y-6 md:p-6 md:space-y-8 font-albert-sans">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter text-primary font-heading-serif">
            Membership
          </h2>
          <p className="text-[9px] md:text-[11px] text-primary/30 uppercase tracking-[0.4em] font-bold mt-1">
            Member Intelligence & Records
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
          <button
            onClick={() => setIsBulkOpen(true)}
            className="flex-1 md:flex-none bg-secondary/10 text-secondary px-4 md:px-6 py-3 md:py-5 rounded-[20px] md:rounded-[22px] text-[9px] md:text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:bg-secondary hover:text-white transition-all"
          >
            <Zap size={16} className="md:w-[18px] md:h-[18px]" />{" "}
            <span className="hidden sm:inline">Power Upload</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-primary text-white px-6 md:px-10 py-3 md:py-5 rounded-[20px] md:rounded-[22px] text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 md:gap-3 hover:scale-105 transition-all"
          >
            <UserPlus size={16} className="md:w-[18px] md:h-[18px]" />{" "}
            <span className="hidden sm:inline">New Registration</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS - Mobile Optimized */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-4 bg-white p-3 md:p-4 rounded-[24px] md:rounded-[30px] shadow-sm border border-gray-50">
        <div className="flex-1 w-full relative">
          <Search
            className="absolute -translate-y-1/2 left-4 md:left-5 top-1/2 text-primary/20 md:w-[18px] md:h-[18px]"
            size={16}
          />
          <input
            className="w-full py-3 md:py-4 pr-4 text-sm font-bold border-none outline-none bg-background/50 rounded-2xl pl-11 md:pl-14"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="bg-background/50 border-none rounded-2xl px-4 md:px-8 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/40 outline-none w-full md:w-auto"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Member">General Member</option>
          <option value="Choir">Choir</option>
          <option value="Media">Media</option>
          <option value="Ushering">Ushering</option>
          <option value="Children">Children</option>
        </select>
      </div>

      {/* MEMBERS LIST - Mobile Optimized (Cards on Mobile, Table on Desktop) */}
      <div className="bg-white rounded-[30px] md:rounded-[45px] border border-gray-50 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex justify-center p-20 text-primary/20">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-20 text-center text-primary/30">
            <p className="text-lg font-black">No members found</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background/30 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">
                  <tr>
                    <th className="px-6 py-4 lg:px-10 lg:py-6">Identity</th>
                    <th className="px-6 py-4 lg:px-10 lg:py-6">Contact</th>
                    <th className="px-6 py-4 lg:px-10 lg:py-6">Dept/Role</th>
                    <th className="px-6 py-4 lg:px-10 lg:py-6 text-right">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member._id}
                      className="transition-all group hover:bg-background/20"
                    >
                      <td className="px-6 py-4 lg:px-10 lg:py-6">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 font-black bg-secondary/5 rounded-xl text-secondary text-sm lg:text-base">
                            {member.title}
                          </div>
                          <div>
                            <h5 className="font-black text-primary text-sm lg:text-base">
                              {member.name}
                            </h5>
                            <p className="text-[9px] lg:text-[10px] text-primary/30 font-bold uppercase flex items-center gap-1.5 mt-0.5">
                              {member.gender} •{" "}
                              <Cake size={10} className="text-secondary" />{" "}
                              {member.dob
                                ? new Date(member.dob).toLocaleDateString()
                                : "No DOB"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 lg:px-10 lg:py-6">
                        <p className="text-xs font-bold text-primary/60">
                          +{member.phone}
                        </p>
                        <p className="text-[10px] text-primary/30 font-medium truncate max-w-[150px]">
                          {member.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 lg:px-10 lg:py-6">
                        <span className="px-3 py-1.5 lg:px-4 lg:py-1.5 bg-background rounded-full text-[8px] lg:text-[9px] font-black uppercase text-secondary tracking-widest border border-secondary/10">
                          {member.dept}
                        </span>
                      </td>
                      <td className="px-6 py-4 lg:px-10 lg:py-6 text-right">
                        <div className="flex justify-end gap-2 transition-all opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() =>
                              navigate("/communications", {
                                state: { directMember: member },
                              })
                            }
                            className="p-2 lg:p-3 transition-all bg-secondary/10 text-secondary rounded-xl hover:bg-secondary hover:text-white"
                          >
                            <MessageSquare
                              size={14}
                              className="lg:w-[16px] lg:h-[16px]"
                            />
                          </button>
                          <button
                            onClick={() => {
                              setFormData(member);
                              setSelectedMember(member);
                              setIsModalOpen(true);
                            }}
                            className="p-2 lg:p-3 transition-all bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white"
                          >
                            <Edit3
                              size={14}
                              className="lg:w-[16px] lg:h-[16px]"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
                            className="p-2 lg:p-3 text-red-500 transition-all bg-red-50 rounded-xl hover:bg-red-500 hover:text-white"
                          >
                            <Trash2
                              size={14}
                              className="lg:w-[16px] lg:h-[16px]"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden divide-y divide-gray-50">
              {filteredMembers.map((member) => (
                <div key={member._id} className="p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMobileExpand(member._id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 font-black bg-secondary/5 rounded-xl text-secondary shrink-0 text-sm">
                        {member.title}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-black text-primary text-sm truncate">
                          {member.name}
                        </h5>
                        <p className="text-[10px] text-primary/30 font-bold uppercase flex items-center gap-1.5 mt-0.5">
                          {member.gender} • {member.dept}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className={`text-primary/30 transition-transform ${expandedMobile === member._id ? "rotate-90" : ""}`}
                    />
                  </div>

                  {/* Expanded Details */}
                  {expandedMobile === member._id && (
                    <div className="mt-3 pt-3 border-t border-gray-50 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[8px] font-black text-primary/30 uppercase tracking-wider">
                            Phone
                          </p>
                          <p className="text-sm font-bold text-primary/70">
                            +{member.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-primary/30 uppercase tracking-wider">
                            Email
                          </p>
                          <p className="text-sm font-bold text-primary/70 truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[8px] font-black text-primary/30 uppercase tracking-wider">
                            Title
                          </p>
                          <p className="text-sm font-bold text-primary/70">
                            {member.title}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-primary/30 uppercase tracking-wider">
                            Dept
                          </p>
                          <span className="inline-block px-3 py-0.5 bg-background rounded-full text-[9px] font-black uppercase text-secondary tracking-widest border border-secondary/10">
                            {member.dept}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() =>
                            navigate("/communications", {
                              state: { directMember: member },
                            })
                          }
                          className="flex-1 p-3 transition-all bg-secondary/10 text-secondary rounded-xl hover:bg-secondary hover:text-white flex items-center justify-center gap-2 text-xs font-black"
                        >
                          <MessageSquare size={14} /> Message
                        </button>
                        <button
                          onClick={() => {
                            setFormData(member);
                            setSelectedMember(member);
                            setIsModalOpen(true);
                          }}
                          className="flex-1 p-3 transition-all bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white flex items-center justify-center gap-2 text-xs font-black"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="flex-1 p-3 text-red-500 transition-all bg-red-50 rounded-xl hover:bg-red-500 hover:text-white flex items-center justify-center gap-2 text-xs font-black"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* REGISTRATION MODAL - Mobile Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-primary/20 backdrop-blur-sm p-4 md:p-6">
          <div className="w-full max-w-lg bg-white rounded-[30px] md:rounded-[50px] shadow-2xl p-6 md:p-12 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <h3 className="text-2xl md:text-3xl font-black font-heading-serif">
                {selectedMember ? "Update Profile" : "New Registration"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 md:p-3 transition-all bg-background rounded-2xl hover:text-red-500"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase text-primary/30 ml-2">
                    Title
                  </label>
                  <select
                    className="w-full px-4 md:px-6 py-3 md:py-4 font-bold outline-none bg-background rounded-2xl text-sm"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  >
                    <option>Sir</option>
                    <option>Ma</option>
                    <option>Pst.</option>
                    <option>Bro</option>
                    <option>Sis</option>
                    <option>Dr</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase text-primary/30 ml-2">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full px-4 md:px-6 py-3 md:py-4 font-bold outline-none bg-background rounded-2xl text-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase text-primary/30 ml-2">
                    Phone
                  </label>
                  <input
                    required
                    className="w-full px-4 md:px-6 py-3 md:py-4 font-bold outline-none bg-background rounded-2xl text-sm"
                    placeholder="070..."
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase text-primary/30 ml-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 md:px-6 py-3 md:py-4 font-bold outline-none bg-background rounded-2xl text-sm"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase text-primary/30 ml-2">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 md:px-6 py-3 md:py-4 font-bold outline-none bg-background rounded-2xl text-sm"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase text-primary/30 ml-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 md:px-6 py-3 md:py-4 text-xs font-bold uppercase outline-none bg-background rounded-2xl"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="text-[8px] md:text-[10px] font-black uppercase text-primary/30 ml-2">
                  Department
                </label>
                <select
                  className="w-full px-4 md:px-6 py-3 md:py-4 font-bold outline-none bg-background rounded-2xl text-sm"
                  value={formData.dept}
                  onChange={(e) =>
                    setFormData({ ...formData, dept: e.target.value })
                  }
                >
                  <option value="Member">General Member</option>
                  <option value="Choir">Choir</option>
                  <option value="Media">Media</option>
                  <option value="Ushering">Ushering</option>
                  <option value="Children">Children Ministry</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-secondary text-white py-4 md:py-6 rounded-[25px] font-black uppercase tracking-widest shadow-xl mt-6 md:mt-10 hover:bg-primary transition-all text-sm"
              >
                {selectedMember ? "Commit Changes" : "Finalize Registration"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POWER UPLOAD MODAL - Mobile Optimized */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-primary/40 backdrop-blur-md p-4 md:p-6">
          <div className="w-full max-w-2xl bg-white rounded-[30px] md:rounded-[50px] shadow-2xl p-6 md:p-12 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <Zap className="text-secondary md:w-6 md:h-6" />
                <h3 className="text-2xl md:text-3xl font-black font-heading-serif">
                  Power Upload
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 md:p-3 bg-background rounded-2xl hover:text-red-500"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <p className="text-[10px] md:text-[11px] font-bold text-primary/40 uppercase mb-4 tracking-wider flex items-center gap-2">
              <ClipboardList size={14} /> Format: Title, Name, Phone, Dept (One
              per line)
            </p>

            <textarea
              className="w-full h-40 md:h-64 bg-background rounded-[24px] md:rounded-[30px] p-6 md:p-8 outline-none font-bold text-sm text-primary border-2 border-transparent focus:border-secondary/20"
              placeholder={`Pst, John Doe, 08012345678, Choir\nSis, Jane Smith, 07099887766, Media`}
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
            />

            <button
              onClick={handleBulkUpload}
              className="w-full bg-secondary text-white py-4 md:py-6 rounded-[25px] font-black uppercase tracking-widest shadow-xl mt-6 md:mt-8 hover:bg-primary transition-all flex items-center justify-center gap-2 md:gap-3 text-sm"
            >
              <Zap size={16} className="md:w-[18px] md:h-[18px]" /> Execute Mass
              Registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
