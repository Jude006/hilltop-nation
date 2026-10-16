import React from "react";
import { motion } from "framer-motion";
import { useTypewriter } from "react-simple-typewriter";

const GalleryHero = () => {
  const [text] = useTypewriter({
    words: ["Worship", "Community", "Miracles", "Service"],
    loop: 0,
    typeSpeed: 80,
    deleteSpeed: 50,
  });

  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-[0px] md:rounded-[50px] shadow-2xl bg-slate-900">
      <div className="absolute inset-0 z-0">
        <img
          src="/img/choir1.jpeg"
          className="object-cover w-full h-full transition-all duration-1000 opacity-40 grayscale hover:grayscale-0"
          alt="Gallery Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="container relative z-10 flex flex-col justify-center h-full px-8 mx-auto md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-secondaryLight/90 font-Montserrat text-xs uppercase tracking-[0.5em] mb-4">
            // Our Visual Story
          </p>

          <h1 className="text-white text-5xl md:text-[100px] font-heading-sans leading-none tracking-tighter uppercase">
            Pure <span className="text-secondaryLight/90">{text}</span>
          </h1>

          <p className="max-w-md mt-8 text-sm font-light leading-relaxed text-white/60 md:text-lg font-albert-sans">
            A window into the life of our church. Witness the joy, the spirit,
            and the family we've built together.
          </p>
        </motion.div>
      </div>

      {/* The Aesthetic Bottom Line */}
      <div className="absolute left-0 z-20 hidden w-full px-16 bottom-12 md:block">
        <div className="w-full h-[1px] bg-white/5 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondaryLight/60 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default GalleryHero;
