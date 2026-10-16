import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Users,
  PlayCircle,
  TrendingUp,
  Loader2,
  SignalHigh,
  Cake,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [statsData, setStatsData] = useState({
    members: 0,
    birthdays: [],
    sermons: 0,
    assets: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const fetchStat = async (endpoint) => {
          try {
            return await apiRequest(endpoint, "GET");
          } catch (e) {
            console.warn(`Stat failed for ${endpoint}:`, e.message);
            return null;
          }
        };

        const [memRes, bdayRes, sermonRes, assetRes] = await Promise.all([
          fetchStat("/members"),
          fetchStat("/celebrants"),
          fetchStat("/sermons"),
          fetchStat("/media/stats/count"), // UPDATED THIS LINE
        ]);

        setStatsData({
          members: Array.isArray(memRes) ? memRes.length : 0,
          birthdays: bdayRes?.celebrants || [],
          sermons: Array.isArray(sermonRes)
            ? sermonRes.length
            : sermonRes?.count || 0,
          assets: assetRes?.count || 0, // UPDATED THIS LINE
        });
      } catch (err) {
        console.error("Critical HTN Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Global Membership",
      value: statsData.members.toLocaleString(),
      change: "+100%",
      icon: <Users className="text-secondary" />,
      color: "bg-secondary/10",
    },
    {
      label: "Digital Sermons",
      value: statsData.sermons.toLocaleString(),
      change: "Live",
      icon: <PlayCircle className="text-accent" />,
      color: "bg-accent/10",
    },
    {
      label: "Media Assets",
      value: statsData.assets.toLocaleString(),
      change: "Synced",
      icon: <SignalHigh className="text-secondaryLight" />,
      color: "bg-secondaryLight/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <Loader2 className="animate-spin text-secondary" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 animate-pulse">
          Syncing HTN Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 duration-700 md:p-10 font-albert-sans animate-in fade-in">
      {/* BIRTHDAY ALERT BANNER */}
      {statsData.birthdays.length > 0 && (
        <div className="bg-gradient-to-r from-secondary to-primary p-[1px] rounded-[35px] shadow-2xl shadow-secondary/20">
          <div className="bg-white p-6 md:p-8 rounded-[34px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex items-center justify-center w-14 h-14 bg-secondary/10 rounded-2xl text-secondary animate-bounce">
                <Cake size={28} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-1">
                  Celebration Intelligence
                </h4>
                <p className="text-lg font-bold text-primary">
                  {statsData.birthdays.length} Member(s) are celebrating today!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {statsData.birthdays.map((b, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-4 border-white bg-secondary text-white flex items-center justify-center text-[10px] font-black shadow-lg"
                  >
                    {b.name ? b.name.charAt(0) : "?"}
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/HTN-admin/flier-generator")}
                className="px-8 py-4 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-secondary/20"
              >
                <Sparkles size={14} /> Create Flier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl text-primary font-heading-serif">
            {user?.name || "Steward"},{" "}
            <span className="capitalize text-secondary/80">
              {user?.role || "Admin"}
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-[10px] md:text-sm tracking-widest uppercase text-primary/50 font-bold">
              HTN Digital Headquarters
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/HTN-admin/members")}
            className="px-6 py-3.5 bg-white border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            Manage Members
          </button>
          <button
            onClick={() => navigate("/HTN-admin/communications")}
            className="px-6 py-3.5 bg-secondary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary/20 hover:-translate-y-0.5 transition-all"
          >
            Quick Broadcast
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 md:p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 ${stat.color} rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125`}
            />
            <div className="relative z-10">
              <div className="inline-block p-3 mb-4 bg-background rounded-2xl">
                {stat.icon}
              </div>
              <p className="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-black mb-1">
                {stat.label}
              </p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-black tracking-tighter md:text-4xl text-primary">
                  {stat.value}
                </h3>
                <span className="text-[9px] font-black text-secondary bg-secondary/5 px-2 py-1 rounded-md mb-1 flex items-center">
                  <TrendingUp size={10} className="mr-1" /> {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-sm font-black tracking-tighter uppercase md:text-lg text-primary">
              System Health
            </h4>
            <button
              onClick={() => navigate("/HTN-admin/members")}
              className="text-[9px] font-black uppercase tracking-widest text-secondary flex items-center gap-1 border-b-2 border-secondary/20 pb-1"
            >
              View All Activity <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Database Synchronized",
                time: "Just now",
                status: "Active",
              },
              {
                title: "Sermon Cloud Online",
                time: "Stable",
                status: "Verified",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 transition-all border border-transparent bg-background rounded-2xl group hover:border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                    <SignalHigh size={16} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {activity.title}
                    </p>
                    <p className="text-[9px] text-primary/40 uppercase font-black">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-black uppercase rounded-full">
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
          <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4">
            <SignalHigh size={240} />
          </div>
          <div className="relative z-10">
            <h4 className="mb-4 text-2xl font-black leading-tight md:text-3xl font-heading-serif">
              Reach your <br /> people <br /> instantly.
            </h4>
            <p className="text-sm font-medium text-white/60">
              Connect via the HTN Global Communication system.
            </p>
          </div>
          <button
            onClick={() => navigate("/HTN-admin/communications")}
            className="relative z-10 w-full py-5 mt-8 bg-white text-primary font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-secondaryLight transition-all shadow-xl"
          >
            Launch Comms Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
