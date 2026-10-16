import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Edit these: the image path, the name and the title under the photo.
// Leave `name` empty ("") to hide the caption.
const PASTOR = {
  img: "/img/htn1.jpeg",
  alt: "Portrait of our pastor",
  name: "",
  title: "Sent Man",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const OurStory = () => {
  const reduce = useReducedMotion();

  return (
    <div className="grid items-start grid-cols-12 gap-y-10 md:gap-x-12 lg:gap-x-20">
      {/* ---------- 1. Heading block (first on mobile, top-right on desktop) ---------- */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="col-span-12 md:col-span-7 md:col-start-6 md:row-start-1"
      >
        <motion.div
          variants={item}
          className="inline-block px-4 py-1 mb-6 border rounded-full border-primary/15"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
            01. Our Story
          </p>
        </motion.div>

        <motion.h2
          variants={item}
          className="text-3xl font-bold uppercase leading-[1] tracking-tighter text-primary sm:text-4xl lg:text-5xl"
        >
          <span className="block">A City of</span>
          <span className="block">Sanctified People.</span>
          <span className="block text-secondaryLight">Raising Christlike Men.</span>
        </motion.h2>

        <motion.div variants={item} className="flex items-center gap-4 mt-8">
          <motion.span
            aria-hidden
            className="block w-12 h-px origin-left bg-secondaryLight"
            variants={{
              hidden: { scaleX: 0 },
              show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          />
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary/60">
            Establishing the Kingdom // Upon the Earth
          </p>
        </motion.div>
      </motion.div>

      {/* ---------- 2. Pastor image (second on mobile, left column on desktop) ---------- */}
      <div className="col-span-12 md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-1 md:sticky md:top-28 md:self-start">
        <div className="relative max-w-sm mx-auto isolate md:max-w-none">
          {/* offset outline */}
          <motion.span
            aria-hidden
            className="absolute inset-0 translate-x-3 translate-y-3 border -z-10 border-secondaryLight/70 md:translate-x-4 md:translate-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          <motion.div
            className="aspect-[4/5] w-full overflow-hidden bg-primary/10"
            initial={{ clipPath: reduce ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: EASE }}
          >
            <motion.img
              src={PASTOR.img}
              alt={PASTOR.alt}
              loading="lazy"
              className="object-cover object-top w-full h-full"
              initial={{ scale: reduce ? 1 : 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE }}
            />
          </motion.div>

          {PASTOR.name && (
            <motion.div
              className="pt-4 mt-6 border-t border-primary/10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            >
              <p className="text-sm font-bold tracking-widest uppercase text-primary">
                {PASTOR.name}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-primary/60">
                {PASTOR.title}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* ---------- 3. Narrative (third on mobile, bottom-right on desktop) ---------- */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="col-span-12 md:col-span-7 md:col-start-6 md:row-start-2"
      >
        <motion.p
          variants={item}
          className="mb-8 text-lg font-light leading-relaxed font-albert-sans text-primary/80 md:text-xl lg:text-2xl"
        >
          Hilltop Nation is a city of sanctified people commissioned to raise
          men whose desire is to be like Christ upon the earth. We are devoted
          to impacting lives through profound worship, the Word, prayer, and
          discipleship, raising Christlike men in character and in every aspect
          of their lives.
        </motion.p>

        <motion.div
          variants={item}
          className="grid grid-cols-1 gap-8 pt-8 border-t border-primary/10 sm:grid-cols-2"
        >
          <div>
            <h3 className="mb-3 text-xs font-bold tracking-widest uppercase text-primary">
              Our Foundation
            </h3>
            <p className="text-sm leading-relaxed font-albert-sans text-primary/70">
              We are built on prayer, the Word of God, and discipleship,
              cultivating spiritual, physical, marital, and financial growth in
              every member.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold tracking-widest uppercase text-primary">
              Our Vision
            </h3>
            <p className="text-sm leading-relaxed font-albert-sans text-primary/70">
              A city of sanctified people commissioned to raise men whose
              desire is to be like Christ upon the earth, establishing the
              Kingdom of our God in every sphere of life.
            </p>
          </div>
        </motion.div>

        <motion.button
          variants={item}
          type="button"
          onClick={() =>
            document
              .getElementById("vision-mission")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex items-center gap-4 mt-10 group focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4"
        >
          <span className="flex items-center justify-center transition-all duration-300 border rounded-full h-11 w-11 border-primary/20 group-hover:border-secondary group-hover:bg-secondary">
            <span
              aria-hidden
              className="text-primary transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
            >
              &rarr;
            </span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Discover our vision &amp; mission
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OurStory;