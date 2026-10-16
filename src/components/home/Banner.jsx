import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-fade";

const SLIDE_DURATION = 6000;

// ✅ Each slide carries its OWN text, shown in sync with its own image.
// Replace the /img/ paths with your actual Hilltop Nation assets.
const slides = [
  {
    image: "/img/htn1.jpeg",
    eyebrow: "Our Leadership",
    heading: "A City of Sanctified People",
    description:
      "Led by God-ordained leadership, Hilltop Nation stands as a city of sanctified people, commissioned to raise men whose desire is to be like Christ upon the earth.",
  },
  {
    image: "/img/choir1.jpeg",
    eyebrow: "Worship Ministry",
    heading: "Voices Raised In Worship",
    description:
      "Anointed praise that ushers in God's presence — our worship team leads the congregation into moments of profound worship and divine encounter.",
  },
  {
    image: "/img/HTN3.jpeg",
    eyebrow: "Our Pastor",
    heading: "Preaching With Power And Purpose",
    description:
      "With passion and precision, our Apostle delivers the Word with clarity and conviction — awakening hearts to God's truth and equipping every believer for their divine assignment.",
  },
  {
    image: "/img/HTN4.jpeg",
    eyebrow: "Our Family",
    heading: "One Family, One Faith",
    description:
      "A vibrant, growing congregation walking together in faith — every member valued, every life impacted, every destiny shaped for God's glory.",
  },
];

const textVariants = {
  enter: { opacity: 0, y: 24 },
  center: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
  exit: { opacity: 0, y: -14, transition: { duration: 0.35 } },
};

const lineVariants = {
  enter: { opacity: 0, y: 16 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -8 },
};

const Banner = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (i) => {
    if (swiperRef.current) swiperRef.current.slideToLoop(i);
  };

  const current = slides[activeIndex];

  return (
    <section className="relative h-[85vh] md:h-screen w-full overflow-hidden rounded-none md:rounded-[40px] shadow-2xl shadow-black/10">
      {/* ── Image carousel ── */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: SLIDE_DURATION, disableOnInteraction: false }}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="absolute inset-0 w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="relative">
            <img
              src={slide.image}
              alt={slide.heading}
              className="object-cover w-full h-full"
            />
            {/* Brand-tinted overlay */}
            <div className="absolute inset-0 bg-overlay/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-overlay/90 via-overlay/40 to-overlay/20" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Text content ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-10 md:px-16">
        <div className="max-w-2xl">
          {/* Persistent mission line — the ministry's core statement */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-albert-sans text-white/90 text-[11px] sm:text-xs uppercase tracking-[0.3em] mb-5 flex md:flex-row flex-col md:items-center gap-2 items-start"
          >
            <span className="text-secondaryLight">
              A City of Sanctified People.
            </span>
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Slide eyebrow */}
              <motion.p
                variants={lineVariants}
                className="font-albert-sans text-secondaryLight text-xs md:text-sm uppercase tracking-[0.35em] mb-3 flex items-center gap-3"
              >
                <span className="w-6 h-px bg-secondaryLight" />
                {current.eyebrow}
              </motion.p>

              {/* Heading */}
              <motion.h1
                variants={lineVariants}
                className="font-heading-sans text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight mb-4"
              >
                {current.heading}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={lineVariants}
                className="max-w-lg mb-8 text-sm leading-relaxed font-albert-sans text-white/80 sm:text-base"
              >
                {current.description}
              </motion.p>

              {/* CTA */}
              <motion.div variants={lineVariants}>
                <Link to="/about">
                  <button className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-secondary to-accent text-white px-6 sm:px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300">
                    Who Are We?
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Arrow navigation ── */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous slide"
        className="absolute z-20 flex items-center justify-center w-10 h-10 text-white transition-colors duration-300 -translate-y-1/2 border rounded-full left-3 sm:left-5 top-1/2 sm:w-11 sm:h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
      >
        <ArrowLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next slide"
        className="absolute z-20 flex items-center justify-center w-10 h-10 text-white transition-colors duration-300 -translate-y-1/2 border rounded-full right-3 sm:right-5 top-1/2 sm:w-11 sm:h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
      >
        <ArrowRight size={18} />
      </button>

      {/* ── Dot indicators + per-slide progress bar ── */}
      <div className="absolute z-20 flex items-center gap-2 -translate-x-1/2 bottom-6 sm:bottom-8 left-1/2">
        {slides.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-[width] duration-300"
              style={{ width: isActive ? 34 : 14 }}
            >
              {isActive && (
                <motion.span
                  key={activeIndex}
                  className="absolute inset-y-0 left-0 rounded-full bg-secondaryLight"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: SLIDE_DURATION / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Banner;