import React from "react";
import { motion } from "framer-motion";
import { useTypewriter } from "react-simple-typewriter";
import { ArrowRight } from "lucide-react";

const AboutHero = () => {
  const [text] = useTypewriter({
    words: ["Revelation", "Revival", "Transformation", "Illumination"],
    loop: 0,
    typeSpeed: 80,
    deleteSpeed: 50,
  });

  return (
    <section className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden rounded-[0px] md:rounded-[50px] shadow-2xl shadow-black/10 bg-slate-900">
      {/* Background Image with optimized overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/about-bg.png"
          className="object-cover w-full h-full opacity-60"
          alt="About Hilltop Nation"
        />
        {/* Signature Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      </div>

      <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Minimalist Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-secondaryLight"></div>
            <span className="text-secondaryLight font-mono text-[10px] uppercase tracking-[0.4em]">
              Our Identity
            </span>
          </div>

          {/* Neat & Scaled Heading */}
          <h1 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-tight leading-[1.1]">
            A journey defined <br />
            by <span className="text-secondaryLight">{text}</span>
          </h1>

          {/* Simple Mission - Short and Clean */}
          <p className="mt-6 text-white/50 font-albert-sans text-sm md:text-lg max-w-xl leading-relaxed">
            Hilltop Nation is dedicated to raising Christ ambassadors who are
            rooted in intimacy with God, transformed into His likeness, and
            empowered to illuminate the world with His truth, love, power, and
            glory.
          </p>

          {/* Refined CTA */}
          <div className="mt-10 flex items-center gap-8">
            <button className="group flex items-center gap-3 text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-secondaryLight transition-colors">
                Read Our Story
              </span>
              <div className="p-2 border border-white/20 rounded-full group-hover:bg-secondaryLight group-hover:border-secondaryLight transition-all">
                <ArrowRight size={14} className="group-hover:text-slate-900" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
