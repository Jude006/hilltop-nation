import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Video,
  Image,
  Mail,
  Users,
  UserPlus,
  Phone,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Calendar,
  Zap,
  Smartphone,
  AlertCircle,
} from "lucide-react";

const AdminSideBar = () => {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Modal state
  const userRole = user?.role?.toLowerCase();

  const menuItems = [
    {
      name: "Overview",
      icon: <LayoutDashboard size={18} />,
      path: "/HTN-admin/dashboard",
    },
    {
      name: "Sermon Library",
      icon: <Video size={18} />,
      path: "/HTN-admin/sermons",
      permission: "Sermons",
    },
    {
      name: "Media Assets",
      icon: <Image size={18} />,
      path: "/HTN-admin/media-assets",
      permission: "Media Assets",
    },
    {
      name: "Membership",
      icon: <Users size={18} />,
      path: "/HTN-admin/members",
      permission: "Membership",
    },
    {
      name: "Communications",
      icon: <Mail size={18} />,
      path: "/HTN-admin/communications",
      permission: "Communications",
    },
    {
      name: "Call Center",
      icon: <Phone size={18} />,
      path: "/HTN-admin/call-center",
      permission: "Communications",
    },
    {
      name: "System Bridge",
      icon: <Smartphone size={18} />,
      path: "/HTN-admin/whatsapp-status",
      adminOnly: true,
    },
    {
      name: "Broadcast",
      icon: <Zap size={18} />,
      path: "/HTN-admin/broadcast",
      adminOnly: true,
    },
    {
      name: "Steward Management",
      icon: <UserPlus size={18} />,
      path: "/HTN-admin/create-worker",
      adminOnly: true,
    },
    {
      name: "Flier Generator",
      icon: <Sparkles size={18} />,
      path: "/HTN-admin/flier-generator",
      adminOnly: true,
    },
    {
      name: "Upcoming Programs",
      icon: <Calendar size={18} />,
      path: "/HTN-admin/upcoming-programs",
      adminOnly: true,
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 1. NEAT LOGOUT POPUP (Centered with Backdrop Blur) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-primary/60 backdrop-blur-md"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-gray-100 scale-in-center animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-primary uppercase tracking-tight mb-2">
                Confirm Sign Out
              </h3>
              <p className="text-sm font-medium text-primary/40 leading-relaxed mb-8">
                Are you sure you want to terminate your current session at HTN
                Digital Headquarters?
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-4 bg-background text-primary/40 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    logoutUser();
                  }}
                  className="py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-[60]">
        <img src="/img/logo.jpeg" alt="Logo" className="h-8 w-auto" />
        <button
          onClick={toggleSidebar}
          className="p-2 bg-secondary/10 text-secondary rounded-xl active:scale-90 transition-all"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[70] lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div
        className={`
        fixed lg:sticky top-0 left-0 z-[80] h-screen bg-white border-r border-gray-100 shadow-sm w-72
        transition-transform duration-500 ease-in-out transform
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* LOGO SECTION */}
        <div className="p-8 mb-4 flex items-center justify-between">
          <div>
            <img src="/img/logo.jpeg" alt="Logo" className="w-auto h-10 mb-3" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <p className="text-[11px] text-primary/50 uppercase tracking-[0.2em] font-black">
                Management
              </p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-primary/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav
          className="flex-1 px-4 space-y-1 overflow-y-auto pb-16 max-h-[calc(100vh-250px)] no-scrollbar"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

          {menuItems.map((item) => {
            if (item.adminOnly && userRole !== "admin") return null;
            if (
              item.permission &&
              userRole !== "admin" &&
              !user?.permissions?.includes(item.permission)
            ) {
              return null;
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]"
                      : "text-primary/60 hover:bg-background hover:text-secondary"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="text-xs font-bold tracking-wider uppercase">
                    {item.name}
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />
              </NavLink>
            );
          })}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50">
          <div className="mb-4 px-4 py-3 bg-background rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-[10px] font-black">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-primary uppercase truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-[9px] font-bold text-primary/30 uppercase tracking-tighter truncate">
                {userRole}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)} // Open modal instead of logging out instantly
            className="flex items-center w-full gap-4 px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all text-red-500 hover:bg-red-50 rounded-xl active:scale-95"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSideBar;
