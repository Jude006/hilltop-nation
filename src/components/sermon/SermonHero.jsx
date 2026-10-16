import React from "react";
import { motion } from "framer-motion";
import { useTypewriter } from "react-simple-typewriter";
import { Play, Calendar } from "lucide-react";

const SermonHero = () => {
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
          src="/img/bga.jpeg"
          className="object-cover w-full h-full opacity-60"
          alt="Latest Message"
        />
        {/* Signature Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      <div className="container relative z-10 flex flex-col justify-center h-full px-8 mx-auto md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Section Indicator */}
          <p className="text-secondaryLight/90 font-Montserrat text-xs uppercase tracking-[0.5em] mb-4">
            // Latest Message
          </p>
            
          {/* Typewriter Heading - Giant Bold Typography */}
          <div className="flex flex-col">
            <h1 className="text-white text-4xl md:text-[70px] font-heading-sans leading-none tracking-tighter uppercase">
              Walking In <br />
              The Light Of{" "}
              <span className="text-secondaryLight/90">{text}</span>
            </h1>
          </div>

          {/* Sermon Metadata */}
          <div className="flex items-center gap-6 mt-6 text-sm text-white/60 font-albert-sans md:text-base">
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-secondaryLight" /> Recent
              Message
            </span>
            <span className="h-[4px] w-[4px] bg-secondaryLight rounded-full"></span>
            <span>Evangelist Moses Adetola</span>
          </div>

          {/* Call to Action */}
          <div className="flex items-center gap-4 mt-12">
            <button className="relative flex items-center gap-3 px-6 py-3 transition-all duration-300 bg-white rounded-full group hover:bg-secondaryLight">
              <span className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                <Play size={14} fill="black" />
                Watch Now
              </span>
            </button>

            <div className="hidden px-5 py-3 border rounded-full border-white/10 bg-white/5 backdrop-blur-md md:block">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em]">
                Series: Walking In Light
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Bottom Line */}
      <div className="absolute left-0 z-20 hidden w-full px-16 bottom-12 md:block">
        <div className="w-full h-[1px] bg-white/5 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondaryLight/60 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default SermonHero;