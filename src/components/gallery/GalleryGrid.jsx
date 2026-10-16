import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, Calendar, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const GalleryGrid = ({ activeCategory }) => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Fetch galleries from backend
  React.useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const data = await apiRequest('/media', 'GET', null, false);
        setGalleries(data);
      } catch (err) {
        console.error("Error fetching galleries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  // Filter galleries by category
  const filteredGalleries = activeCategory === "All" 
    ? galleries 
    : galleries.filter(gallery => gallery.category === activeCategory);

  const openLightbox = (gallery, imageIndex) => {
    setSelectedGallery(gallery);
    setSelectedImageIndex(imageIndex);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedGallery(null);
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const handleNext = () => {
    if (selectedGallery && selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev + 1) % selectedGallery.images.length);
    }
  };

  const handlePrev = () => {
    if (selectedGallery && selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev - 1 + selectedGallery.images.length) % selectedGallery.images.length);
    }
  };

  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 rounded-full border-secondary/20 border-t-secondary animate-spin"></div>
      </div>
    );
  }

  if (filteredGalleries.length === 0) {
    return (
      <div className="py-20 text-center">
        <ImageIcon size={48} className="mx-auto text-primary/20" />
        <p className="mt-4 text-primary/40">No galleries found.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Gallery Cards Grid - 3 columns on desktop */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredGalleries.map((gallery, galleryIndex) => (
          <motion.div
            key={gallery._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: galleryIndex * 0.1 }}
            whileHover={{ y: -8 }}
            className="overflow-hidden transition-all duration-500 bg-white shadow-lg group rounded-3xl hover:shadow-2xl"
          >
            {/* Cover Image - Click to open gallery */}
            <div 
              onClick={() => openLightbox(gallery, 0)}
              className="relative overflow-hidden cursor-pointer aspect-[4/3] bg-gray-100 max-h-[300px] w-full" 
            >
              {gallery.coverImage ? (
                <img 
                  src={gallery.coverImage} 
                  alt={gallery.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-110 h-[100%] w-[100%]"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <ImageIcon size={48} className="text-primary/20" />
                </div>
              )}
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/50 group-hover:opacity-100">
                <div className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white uppercase rounded-full bg-secondary">
                  <FolderOpen size={16} />
                  View {gallery.images.length} Photos
                </div>
              </div>
            </div>

            {/* Gallery Info */}
            <div className="p-5">
              <h3 className="text-xl font-black tracking-tighter uppercase text-primary line-clamp-1">
                {gallery.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-[10px] font-black text-secondary uppercase tracking-wider">
                  {gallery.category || "Gallery"}
                </span>
                <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                <span className="text-[10px] font-black text-primary/40 uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={10} /> 
                  {gallery.date ? new Date(gallery.date).toLocaleDateString() : "Recent"}
                </span>
              </div>

              {/* Image Previews Row */}
              <div className="flex gap-2 mt-4">
                {gallery.images.slice(0, 4).map((image, idx) => (
                  <div 
                    key={image._id}
                    onClick={() => openLightbox(gallery, idx)}
                    className="relative overflow-hidden bg-gray-100 rounded-lg cursor-pointer w-14 h-14"
                  >
                    <img 
                      src={image.url} 
                      alt={`Preview ${idx + 1}`}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ))}
                {gallery.images.length > 4 && (
                  <div 
                    onClick={() => openLightbox(gallery, 4)}
                    className="flex items-center justify-center w-14 h-14 text-[10px] font-black text-white uppercase bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80"
                  >
                    +{gallery.images.length - 4}
                  </div>
                )}
              </div>

              {/* View All Button */}
              <button
                onClick={() => openLightbox(gallery, 0)}
                className="w-full py-3 mt-5 text-xs font-black uppercase transition-all border-2 border-primary/10 text-primary rounded-xl hover:bg-secondary hover:border-secondary hover:text-white"
              >
                View All {gallery.images.length} Photos →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX OVERLAY (Same as before) */}
      <AnimatePresence>
        {selectedGallery && selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <button 
              onClick={handlePrev} 
              className="absolute p-2 transition-all left-4 md:left-8 text-white/30 hover:text-secondaryLight"
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>
            
            <button 
              onClick={handleNext} 
              className="absolute p-2 transition-all right-4 md:right-8 text-white/30 hover:text-secondaryLight"
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>

            <div className="relative flex flex-col items-center justify-center w-full h-full max-w-5xl">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={selectedGallery.images[selectedImageIndex].url}
                className="max-h-[80vh] w-auto rounded-2xl shadow-2xl object-contain"
              />

              <div className="flex items-center gap-8 mt-8">
                <div className="text-center">
                  <p className="text-secondaryLight text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                    {selectedGallery.category || "Gallery"}
                  </p>
                  <h3 className="text-xl tracking-tighter text-white uppercase font-heading-sans">
                    {selectedGallery.title}
                  </h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">
                    {selectedImageIndex + 1} of {selectedGallery.images.length}
                  </p>
                </div>
                
                <div className="flex gap-4 pl-8 border-l border-white/10">
                  <button 
                    onClick={() => handleDownload(selectedGallery.images[selectedImageIndex].url, selectedGallery.title)}
                    className="p-4 text-white transition-all rounded-full bg-white/5 hover:bg-white/10"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button className="p-4 text-white transition-all rounded-full bg-white/5 hover:bg-white/10">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;