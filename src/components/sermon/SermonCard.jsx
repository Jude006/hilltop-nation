import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Download, ArrowRight, Loader2, User, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { getThumbnail, isDirectVideo, formatSermonDate } from "../../lib/videoHelpers";

const SermonCard = ({ sermon, index }) => {
  const [downloading, setDownloading] = useState(false);
  const videoUrl = sermon?.videoUrl || sermon?.link;
  const thumbnail = getThumbnail(sermon);
  const canDownload = isDirectVideo(videoUrl);
  const isNew =
    sermon?.date && Date.now() - new Date(sermon.date).getTime() < 1000 * 60 * 60 * 24 * 7;

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canDownload || downloading) return;

    setDownloading(true);
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${(sermon.title || "sermon").replace(/[^a-z0-9]/gi, "_")}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Couldn't download directly — opening the video instead");
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="overflow-hidden transition-shadow duration-300 bg-white group rounded-3xl hover:shadow-xl hover:shadow-black/5"
    >
      <Link to={`/sermon/${sermon._id}`} className="block">
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-primary aspect-video">
          {thumbnail.type === "image" && (
            <img
              src={thumbnail.src}
              alt={sermon.title}
              loading="lazy"
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {thumbnail.type === "video" && (
            <video
              src={thumbnail.src}
              muted
              preload="metadata"
              playsInline
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {thumbnail.type === "none" && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-black" />
          )}

          <div className="absolute inset-0 transition-colors bg-black/30 group-hover:bg-black/40" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center transition-transform duration-300 rounded-full w-14 h-14 bg-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/30">
              <Play size={22} className="ml-1 text-white" fill="white" />
            </span>
          </div>

          {isNew && (
            <span className="absolute px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white rounded-full top-4 left-4 bg-secondary">
              New
            </span>
          )}

          {sermon.duration && (
            <span className="absolute px-2.5 py-1 text-[10px] font-bold text-white rounded-md bottom-4 left-4 bg-black/60 backdrop-blur-sm">
              {sermon.duration}
            </span>
          )}

          {canDownload && (
            <button
              type="button"
              onClick={handleDownload}
              aria-label="Download sermon"
              disabled={downloading}
              className="absolute flex items-center justify-center w-10 h-10 text-white transition-all duration-300 rounded-full opacity-0 top-4 right-4 bg-black/50 backdrop-blur-sm hover:bg-secondary group-hover:opacity-100 disabled:opacity-100"
            >
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-6 sm:p-7">
          <h3 className="mb-3 text-2xl font-black tracking-tighter uppercase transition-colors sm:text-3xl text-primary font-heading-sans group-hover:text-secondary">
            {sermon.title}
          </h3>

          <div className="flex flex-wrap items-center mb-5 text-sm gap-x-4 gap-y-1 text-primary/50">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatSermonDate(sermon.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {sermon.speaker || "Radiant Illumination"}
            </span>
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-black tracking-wide uppercase text-secondary">
            Watch Full Sermon
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default SermonCard;