import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Download,
  Heart,
  MessageCircle,
  Share2,
  ArrowRight,
  User,
  X,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/sermons`;

// Helper: Format URL for Iframe
const getEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com/watch?v="))
    return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "youtube.com/embed/");
  if (url.includes("facebook.com"))
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
  if (url.includes("tiktok.com")) {
    const match = url.match(/\/video\/(\d+)/);
    if (match && match[1]) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }
  return url;
};

const SermonSanctuary = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSermon, setActiveSermon] = useState(null);
  const [likedSermons, setLikedSermons] = useState({});

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        const sermonData = Array.isArray(res.data) ? res.data : res.data.data;

        if (sermonData) {
          setSermons(sermonData.slice(0, 3));
        }
      } catch (err) {
        console.error("Sanctuary sync failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();

    // Load liked state from localStorage
    const savedLikes = JSON.parse(localStorage.getItem("likedSermons") || "{}");
    setLikedSermons(savedLikes);
  }, []);

  const handleLike = async (id) => {
    const isCurrentlyLiked = likedSermons[id];
    const newAction = isCurrentlyLiked ? "unlike" : "like";

    // Optimistic UI update
    setSermons((prev) =>
      prev.map((s) =>
        s._id === id
          ? {
              ...s,
              publicLikes: Math.max(
                0,
                (s.publicLikes || 0) + (newAction === "like" ? 1 : -1),
              ),
            }
          : s,
      ),
    );

    // Update liked state
    const newLikedState = { ...likedSermons, [id]: !isCurrentlyLiked };
    setLikedSermons(newLikedState);
    localStorage.setItem("likedSermons", JSON.stringify(newLikedState));

    try {
      const res = await axios.post(`${API_URL}/${id}/like`, {
        action: newAction,
      });
      // Sync with server response
      setSermons((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, publicLikes: res.data.likes } : s,
        ),
      );
    } catch (err) {
      // Revert on failure
      setSermons((prev) =>
        prev.map((s) =>
          s._id === id
            ? {
                ...s,
                publicLikes: Math.max(
                  0,
                  (s.publicLikes || 0) + (newAction === "like" ? -1 : 1),
                ),
              }
            : s,
        ),
      );
      setLikedSermons(likedSermons);
      localStorage.setItem("likedSermons", JSON.stringify(likedSermons));
      console.error("Like failed:", err);
    }
  };

  return (
    <section className="py-24 bg-[#f0f0f0] px-6 md:px-12 lg:px-24 font-albert-sans overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* --- Header --- */}
        <div className="flex flex-col justify-between gap-6 mb-16 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="h-[1px] w-12 bg-secondary/40"></span>
              <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">
                Spiritual Nourishment
              </span>
            </div>
            <h2 className="text-5xl tracking-tighter uppercase md:text-6xl font-heading-serif text-primary">
              Recent <span className="text-secondary">Sermons.</span>
            </h2>
          </motion.div>

          <Link to="/sermon">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-secondary transition-all"
            >
              Enter Library <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>

        {/* --- Loading State --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">
              Syncing Sanctuary...
            </p>
          </div>
        ) : sermons.length === 0 ? (
          <div className="py-20 text-center text-primary/40">
            <p className="text-sm font-bold uppercase tracking-widest">
              No sermons available yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon, index) => {
              const videoUrl = sermon.videoUrl || sermon.link;
              const isLiked = likedSermons[sermon._id] || false;

              return (
                <motion.div
                  key={sermon._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col h-full bg-white rounded-[35px_5px_35px_5px] shadow-sm overflow-hidden"
                >
                  {/* Thumbnail Area */}
                  <div className="relative overflow-hidden aspect-video bg-primary">
                    <img
                      src={sermon.thumbnail || "/img/HTN6.jpeg"}
                      alt={sermon.title}
                      className="object-cover object-top w-full h-full transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        onClick={() => setActiveSermon(sermon)}
                        className="flex items-center justify-center w-16 h-16 text-white rounded-full shadow-2xl bg-secondary/90 backdrop-blur-md"
                      >
                        <Play size={24} fill="white" />
                      </motion.button>
                    </div>

                    <div className="absolute bottom-4 left-6 flex gap-4 text-white text-[10px] font-black tracking-widest uppercase">
                      <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full">
                        <Heart size={12} className="text-secondary" />{" "}
                        {sermon.publicLikes || 0}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full">
                        <MessageCircle size={12} className="text-secondary" />{" "}
                        {sermon.comments?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <User size={12} className="text-secondary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                        {sermon.speaker}
                      </span>
                    </div>

                    <h3 className="mb-8 text-2xl leading-tight transition-colors font-heading-serif text-primary group-hover:text-secondary line-clamp-2">
                      {sermon.title}
                    </h3>

                    <div className="flex items-center justify-between pt-6 mt-auto border-t border-secondary/10">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLike(sermon._id)}
                          className={`transition-all ${isLiked ? "text-red-500" : "text-primary/40 hover:text-secondary"}`}
                        >
                          <Heart
                            size={18}
                            fill={isLiked ? "currentColor" : "none"}
                          />
                        </button>
                        <Link
                          to={`/sermon/${sermon._id}`}
                          className="transition-all text-primary/40 hover:text-secondary"
                        >
                          <MessageCircle size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator
                                .share({
                                  title: sermon.title,
                                  text:
                                    sermon.desc ||
                                    `Watch "${sermon.title}" from Hilltop Nation`,
                                  url: `${window.location.origin}/sermon/${sermon._id}`,
                                })
                                .catch(() => {});
                            } else {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/sermon/${sermon._id}`,
                              );
                            }
                          }}
                          className="transition-all text-primary/40 hover:text-secondary"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>

                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-secondary font-black uppercase text-[9px] tracking-widest hover:translate-y-[-2px] transition-transform"
                      >
                        <Download size={14} /> Download
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* --- Video Player Modal --- */}
        <AnimatePresence>
          {activeSermon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
              onClick={() => setActiveSermon(null)}
            >
              <button
                onClick={() => setActiveSermon(null)}
                className="absolute transition-colors top-10 right-10 text-white/50 hover:text-white"
              >
                <X size={40} />
              </button>
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className={`w-full ${
                  activeSermon.videoUrl?.includes("tiktok")
                    ? "max-w-[400px] aspect-[9/16]"
                    : "max-w-5xl aspect-video"
                } overflow-hidden bg-black border-4 shadow-2xl rounded-3xl border-white/10`}
                onClick={(e) => e.stopPropagation()}
              >
                {activeSermon.videoUrl?.match(/\.(mp4|webm|ogg|mov)$/) ||
                activeSermon.videoUrl?.includes("cloudinary") ? (
                  <video
                    controls
                    autoPlay
                    className="object-contain w-full h-full"
                  >
                    <source src={activeSermon.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <iframe
                    src={getEmbedUrl(
                      activeSermon.videoUrl || activeSermon.link,
                    )}
                    className="w-full h-full border-none"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SermonSanctuary;
