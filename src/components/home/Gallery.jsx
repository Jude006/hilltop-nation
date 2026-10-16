import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { apiRequest } from "../../lib/api";
import { Link } from "react-router-dom";

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6); // Show 6 images initially

  // Fetch galleries from backend
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const data = await apiRequest("/media", "GET", null, false);
        setGalleries(data);
      } catch (err) {
        console.error("Error fetching galleries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  // Flatten all images from all galleries into a single array
  const allImages = galleries.flatMap((gallery) =>
    gallery.images.map((img) => ({
      id: img._id,
      url: img.url,
      title: gallery.title,
      category: gallery.category,
    })),
  );

  const openModal = (img, index) => {
    setSelectedImg(img);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImg(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % allImages.length;
    setSelectedImg(allImages[nextIdx]);
    setCurrentIndex(nextIdx);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const prevIdx = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImg(allImages[prevIdx]);
    setCurrentIndex(prevIdx);
  };

  const showMoreImages = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const showLessImages = () => {
    setVisibleCount(6);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImg) return;
      if (e.key === "ArrowRight") nextImage(e);
      if (e.key === "ArrowLeft") prevImage(e);
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg, currentIndex]);

  // Get visible images based on count
  const visibleImages = allImages.slice(0, visibleCount);
  const hasMore = visibleCount < allImages.length;
  const hasLess = visibleCount > 6;

  if (loading) {
    return (
      <section className="py-24 bg-[#F2F1ED] px-6 md:px-12 lg:px-24 font-albert-sans">
        <div className="container mx-auto text-center">
          <Loader2 size={50} className="mx-auto text-secondary animate-spin" />
          <p className="mt-4 text-primary/60">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#F2F1ED] px-6 md:px-12 lg:px-24 font-albert-sans">
      <div className="container mx-auto">
        {/* --- Header --- */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-[1px] w-12 bg-secondary/40"></span>
            <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">
              Moments of Glory
            </span>
          </div>
          <h2 className="text-5xl tracking-tighter uppercase md:text-7xl font-heading-serif text-primary">
            Our <span className="text-secondary">Gallery.</span>
          </h2>
          <p className="max-w-2xl mt-4 text-primary/60">
            Capturing the beauty of worship, fellowship, and community at
            Hilltop Nation.
          </p>
        </div>

        {/* --- Grid Layout --- */}
        {allImages.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-primary/40">
              No images available yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-10"
            >
              {visibleImages.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 6) * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() =>
                    openModal(
                      img,
                      allImages.findIndex((i) => i.id === img.id),
                    )
                  }
                  className="relative group cursor-pointer overflow-hidden shadow-xl aspect-[16/10] rounded-[30px]"
                >
                  <img
                    src={img.url}
                    alt={img.title || "Church Gallery"}
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 opacity-0 bg-primary/30 group-hover:opacity-100">
                    <div className="flex flex-col items-center justify-center gap-2 p-5 transition-all duration-500 scale-90 border rounded-full bg-black/70 backdrop-blur-sm border-white/20 group-hover:scale-100">
                      <Maximize2 size={18} className="text-white" />
                      <p className="text-white font-black uppercase text-[10px] tracking-widest">
                        View
                      </p>
                    </div>
                  </div>

                  {/* Optional: Category Badge */}
                  {img.category && (
                    <div className="absolute px-3 py-1 text-[8px] font-black text-white uppercase bg-secondary/80 backdrop-blur-sm rounded-full bottom-3 left-3">
                      {img.category}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* --- See More / See Less Buttons --- */}
            <div className="flex flex-col items-center justify-center gap-4 mt-12">
              <div className="flex gap-4">
                {hasMore && (
                  <button
                    onClick={showMoreImages}
                    className="flex items-center gap-2 px-8 py-3 text-sm font-black tracking-wider uppercase transition-all rounded-full group bg-secondary text-primary hover:bg-primary hover:text-white"
                  >
                    See More
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                )}

                {hasLess && (
                  <button
                    onClick={showLessImages}
                    className="px-8 py-3 text-sm font-black uppercase transition-all border-2 rounded-full border-primary/20 text-primary hover:bg-primary/5"
                  >
                    See Less
                  </button>
                )}
              </div>

              {/* View All Gallery Button */}
              <Link to="/gallery">
                <button className="px-6 py-2 text-xs font-black uppercase transition-all text-primary/40 hover:text-secondary">
                  View Full Gallery →
                </button>
              </Link>
            </div>
          </>
        )}

        {/* --- Lightbox Modal (Same design) --- */}
        <AnimatePresence>
          {selectedImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            >
              <button
                className="absolute transition-colors top-8 right-8 text-white/50 hover:text-white"
                onClick={closeModal}
              >
                <X size={36} strokeWidth={1} />
              </button>

              <div className="absolute z-10 flex justify-between -translate-y-1/2 pointer-events-none inset-x-4 md:inset-x-12 top-1/2">
                <motion.button
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="p-4 text-white transition-all border rounded-full pointer-events-auto bg-white/5 border-white/10 backdrop-blur-md"
                >
                  <ChevronLeft size={30} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="p-4 text-white transition-all border rounded-full pointer-events-auto bg-white/5 border-white/10 backdrop-blur-md"
                >
                  <ChevronRight size={30} />
                </motion.button>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-7xl max-h-[85vh] cursor-default rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[12px] border-black"
              >
                <img
                  src={selectedImg.url}
                  alt="Gallery Detail"
                  className="object-contain w-full h-full"
                />

                <div className="absolute p-3 rounded-full bottom-4 right-4 bg-primary/70 backdrop-blur-sm">
                  <p className="text-secondaryLight font-black uppercase tracking-[0.3em] text-[10px]">
                    {currentIndex + 1} of {allImages.length}
                  </p>
                </div>

                {selectedImg.title && (
                  <div className="absolute p-3 rounded-full bottom-4 left-4 bg-primary/70 backdrop-blur-sm">
                    <p className="text-white font-black uppercase tracking-[0.3em] text-[10px]">
                      {selectedImg.title}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
