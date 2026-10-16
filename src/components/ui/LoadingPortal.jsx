import React from 'react';
import { motion } from 'framer-motion';

const LoadingPortal = ({ fullPage = true }) => {
  return (
    <div className={`flex items-center justify-center ${fullPage ? 'fixed inset-0 z-[100] bg-black' : 'w-full h-64 bg-transparent'}`}>
      <div className="relative flex items-center justify-center">
        
        {/* The Spinning Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-2 rounded-full border-white/5 border-t-secondary"
        />

        {/* The Pulsing Logo Text */}
        <div className="absolute flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="text-white font-black tracking-[0.3em] uppercase text-[10px]"
          >
            HTN
          </motion.span>
          
          {/* Decorative Dot */}
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1 h-1 mt-1 rounded-full bg-secondary"
          />
        </div>

        {/* Outer Glow Effect */}
        <div className="absolute w-32 h-32 bg-secondary/10 blur-[40px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default LoadingPortal;