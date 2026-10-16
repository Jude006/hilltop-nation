import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Calendar,
  User,
  Play,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
} from "lucide-react";
import { apiRequest } from "../lib/api";
import { toast } from "react-toastify";

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

const SermonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingComment, setPendingComment] = useState("");

  // Fetch sermon details
  useEffect(() => {
    const fetchSermon = async () => {
      try {
        const data = await apiRequest(`/sermons`, "GET", null, false);
        const foundSermon = data.find((s) => s._id === id);
        setSermon(foundSermon);

        // Use publicLikes from database
        const likes = foundSermon?.publicLikes || 0;
        setLikeCount(likes);
        setCommentCount(foundSermon?.comments?.length || 0);

        // Check if user already liked this sermon (localStorage)
        const likedStatus = localStorage.getItem(`liked_${id}`);
        setIsLiked(likedStatus === "true");
      } catch (err) {
        console.error("Error fetching sermon:", err);
        toast.error("Could not load sermon");
      } finally {
        setLoading(false);
      }
    };
    fetchSermon();
  }, [id]);

  // Handle Like
  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    // Optimistic update
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    // Store in localStorage
    localStorage.setItem(`liked_${id}`, newLikedState);

    try {
      const action = newLikedState ? "like" : "unlike";
      const response = await apiRequest(
        `/sermons/${id}/like`,
        "POST",
        { action },
        false,
      );
      setLikeCount(response.likes);
    } catch (err) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikeCount((prev) => (newLikedState ? prev - 1 : prev + 1));
      localStorage.setItem(`liked_${id}`, !newLikedState);
      console.error("Like error:", err);
      toast.error("Could not process like");
    }
  };

  // Prepare comment with name
  const prepareComment = (text) => {
    const savedName = localStorage.getItem("commenter_name");
    if (savedName) {
      submitComment(text, savedName);
    } else {
      setPendingComment(text);
      setShowNamePrompt(true);
    }
  };

  // Submit comment
  const submitComment = async (text, name) => {
    try {
      const response = await apiRequest(
        `/sermons/${id}/comment`,
        "POST",
        {
          text: text,
          userName: name,
        },
        false,
      );

      setSermon((prev) => ({
        ...prev,
        comments: response,
      }));
      setCommentCount(response.length);
      setCommentText("");
      toast.success("Comment added!");

      // Save name for future
      localStorage.setItem("commenter_name", name);
    } catch (err) {
      toast.error("Could not add comment");
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    prepareComment(commentText);
  };

  // Check video type
  const videoUrl = sermon?.videoUrl || sermon?.link;
  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo =
    videoUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ||
    videoUrl?.includes("cloudinary");
  const isTikTok = videoUrl?.includes("tiktok.com");
  const isYouTube =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");
  const isFacebook = videoUrl?.includes("facebook.com");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
        <div className="w-12 h-12 border-4 rounded-full border-secondary/20 border-t-secondary animate-spin"></div>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f0f0]">
        <p className="text-2xl font-black text-primary">Sermon not found</p>
        <button
          onClick={() => navigate("/sermon")}
          className="mt-4 text-secondary hover:underline"
        >
          Back to Sermons
        </button>
      </div>
    );
  }

  const formattedDate = sermon.date
    ? new Date(sermon.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recent";

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Name Prompt Modal */}
      <AnimatePresence>
        {showNamePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNamePrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-2xl font-black text-primary">
                Your Name
              </h3>
              <p className="mb-6 text-primary/60">
                Please enter your name to post a comment
              </p>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-4 mb-6 border outline-none rounded-2xl focus:ring-2 focus:ring-secondary/20"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNamePrompt(false)}
                  className="flex-1 py-3 font-black border border-gray-200 rounded-xl text-primary/60"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (userName.trim()) {
                      setShowNamePrompt(false);
                      submitComment(pendingComment, userName);
                      setUserName("");
                      setPendingComment("");
                    } else {
                      toast.error("Please enter your name");
                    }
                  }}
                  className="flex-1 py-3 font-black text-white rounded-xl bg-secondary"
                >
                  Post Comment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Video */}
      <div className="relative bg-black">
        <div className="p-0 md:p-4">
          <div
            className={`relative overflow-hidden bg-black rounded-[0px] md:rounded-[50px] ${isTikTok ? "aspect-[9/16] max-w-[400px] mx-auto" : "aspect-video"}`}
          >
            {isDirectVideo ? (
              <video
                controls
                autoPlay
                className="absolute inset-0 w-full h-full"
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : isYouTube || isFacebook || embedUrl ? (
              <iframe
                src={embedUrl + (isYouTube ? "?autoplay=1&rel=0" : "")}
                className="absolute inset-0 w-full h-full border-none"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                title={sermon.title}
              ></iframe>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-primary">
                <Play size={64} className="text-white/20" />
                <p className="absolute text-white/40">Video unavailable</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl px-6 py-12 mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/sermon")}
          className="flex items-center gap-2 mb-8 text-sm font-black uppercase transition-colors text-primary/40 hover:text-secondary"
        >
          <ArrowLeft size={16} /> Back to Sermons
        </button>

        {/* Title & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block px-3 py-1 mb-4 text-[9px] font-black text-secondary uppercase bg-secondary/10 rounded-full">
            {sermon.category || "Sermon"}
          </span>

          <h1 className="text-4xl font-black tracking-tighter uppercase md:text-6xl text-primary font-heading-sans">
            {sermon.title}
          </h1>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2 text-primary/40">
              <User size={16} />
              <span className="text-sm font-bold tracking-wider uppercase">
                {sermon.speaker || "Hilltop Nation"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary/40">
              <Calendar size={16} />
              <span className="text-sm font-bold tracking-wider uppercase">
                {formattedDate}
              </span>
            </div>
            {sermon.duration && (
              <div className="flex items-center gap-2 text-primary/40">
                <Clock size={16} />
                <span className="text-sm font-bold tracking-wider uppercase">
                  {sermon.duration}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Description */}
        {sermon.desc && (
          <div className="p-6 mt-8 italic bg-white/50 rounded-2xl">
            <p className="leading-relaxed text-primary/70">{sermon.desc}</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex gap-6 py-6 my-6 border-t border-b border-gray-200">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all ${isLiked ? "text-red-500" : "text-primary/40 hover:text-red-500"}`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            <span className="font-black">{likeCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 transition-all text-primary/40 hover:text-secondary"
          >
            <MessageCircle size={20} />
            <span className="font-black">{commentCount}</span>
            {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: sermon.title,
                  text: sermon.desc,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }
            }}
            className="flex items-center gap-2 transition-all text-primary/40 hover:text-secondary"
          >
            <Share2 size={18} />
            <span className="font-black">Share</span>
          </button>
        </div>

        {/* Comments Section - Collapsible */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 overflow-hidden"
            >
              <h3 className="mb-6 text-2xl font-black tracking-tighter uppercase text-primary">
                Comments ({commentCount})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this message..."
                  className="w-full p-4 border-none outline-none resize-none rounded-2xl bg-white/80 focus:ring-2 focus:ring-secondary/20"
                  rows="3"
                />
                <button
                  type="submit"
                  className="px-6 py-2 mt-3 text-sm font-black text-white uppercase transition-colors rounded-full bg-secondary hover:bg-primary"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {sermon.comments?.length === 0 ? (
                  <p className="text-primary/40">
                    No comments yet. Be the first to share!
                  </p>
                ) : (
                  sermon.comments?.map((comment, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-5 transition-shadow bg-white shadow-sm rounded-2xl hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10">
                            <User size={14} className="text-secondary" />
                          </div>
                          <span className="text-sm font-black text-primary">
                            {comment.userName || "Anonymous"}
                          </span>
                        </div>
                        <span className="text-[10px] text-primary/30">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="pl-10 text-primary/70">{comment.text}</p>
                      <div className="flex items-center gap-4 pl-10 mt-3">
                        <button className="flex items-center gap-1 text-[10px] text-primary/30 hover:text-secondary transition-colors">
                          <ThumbsUp size={12} /> Like
                        </button>
                        <button className="flex items-center gap-1 text-[10px] text-primary/30 hover:text-secondary transition-colors">
                          Reply
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SermonDetails;
