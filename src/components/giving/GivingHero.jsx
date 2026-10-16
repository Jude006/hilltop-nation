import React from "react";
import { motion } from "framer-motion";

const GivingHero = () => {
  return (
    <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden bg-overlay">
      {/* Background image */}
      <div className="absolute inset-0">
        <motion.img
          src="/img/bga.jpeg"
          alt="Support the Gospel"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="object-cover object-center w-full h-full"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-overlay/85 via-overlay/85 to-overlay/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 mt-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white/60 font-albert-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] mb-6"
        >
          Support The Gospel
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading-sans font-black uppercase tracking-tight leading-[0.85] text-white text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]"
        >
          Giving
        </motion.h1>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-2xl mt-10"
        >
          <p className="text-base italic leading-relaxed text-white/80 font-albert-sans sm:text-lg md:text-xl">
            "Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a cheerful
            giver."
          </p>
          <cite className="block mt-3 text-xs not-italic tracking-widest text-white/50 font-albert-sans sm:text-sm">
            — 2 Corinthians 9:7
          </cite>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-3 mt-14"
        >
          <p className="text-white/50 font-albert-sans text-[10px] uppercase tracking-[0.35em]">
            Bank Details Below
          </p>
          <motion.span
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 origin-top bg-white/30"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default GivingHero;