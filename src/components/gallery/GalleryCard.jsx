import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

const GalleryCard = ({ image, index, onOpen }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onOpen(index)}
      className="relative mb-6 cursor-pointer group break-inside-avoid"
    >
      <div className="relative overflow-hidden rounded-[20px] md:rounded-[30px] bg-gray-200 shadow-sm transition-all duration-500 group-hover:shadow-2xl border border-black/5">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <div>
              <p className="text-[10px] font-black text-secondaryLight uppercase tracking-widest">{image.category}</p>
              <p className="text-white text-sm font-bold uppercase tracking-tight">{image.title}</p>
            </div>
            <div className="bg-secondaryLight p-2 rounded-full text-black">
              <Maximize2 size={16} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCard;