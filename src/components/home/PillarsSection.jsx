import React from "react";
import { motion } from "framer-motion";
import { Award, Target, Zap, Shield, Star } from "lucide-react";

const PillarsSection = () => {
  const pillars = [
    {
      title: "Excellence",
      icon: <Award size={24} />,
      description:
        "The quality of being outstanding and extremely good. Excellence means surpassing ordinary standards — becoming the best in whatever we do and standing out from the crowd.",
      number: "01",
    },
    {
      title: "Effectiveness",
      icon: <Target size={24} />,
      description:
        "The capability of producing a desired result. Without focus, effectiveness cannot be achieved; without concentration, you cannot attain it. We are a people who produce tremendous results in anything we do.",
      number: "02",
    },
    {
      title: "Efficiency",
      icon: <Zap size={24} />,
      description:
        "The ability to do things well, successfully, and without wasting time, energy, or resources. We see this in Jesus feeding the 5,000 — nothing was wasted, yet twelve baskets remained.",
      number: "03",
    },
    {
      title: "Integrity",
      icon: <Shield size={24} />,
      description:
        "The act of being whole. Being true to one's commitment. As a people, we believe in doing whatever it takes to keep our word no matter what.",
      number: "04",
    },
  ];

  return (
    <section className="px-4 py-16 overflow-hidden bg-[#f0f0f0] md:py-24 md:px-12 lg:px-24 font-albert-sans">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Star size={14} className="text-secondary" />
            <span className="text-secondary font-bold tracking-[0.35em] uppercase text-[10px]">
              Our Foundation
            </span>
            <Star size={14} className="text-secondary" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-black tracking-tight md:text-5xl lg:text-6xl font-heading-sans text-primary"
          >
            Our Core <span className="text-secondary">Values.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="max-w-2xl mx-auto mt-4 text-sm md:mt-6 md:text-base text-primary/50"
          >
            The four values that guide our Faith walk, work, purpose, and
            Kingdom impact.
          </motion.p>
        </div>

        {/* Grid — 4 core values */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
              className="relative flex flex-col p-6 transition-all duration-500 bg-white border border-gray-100 group md:p-7 rounded-2xl hover:border-secondary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              {/* Number Badge */}
              <span className="text-[10px] font-bold text-primary/20 mb-4 font-albert-sans tracking-widest">
                {pillar.number}
              </span>

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 mb-5 transition-all duration-500 rounded-xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white">
                {pillar.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-black tracking-tight font-heading-sans text-primary">
                {pillar.title}
              </h3>

              {/* Divider */}
              <div className="w-8 h-[2px] bg-secondary/30 mb-4 group-hover:w-14 transition-all duration-500" />

              {/* Description */}
              <p className="text-sm leading-relaxed text-primary/55">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative px-6 py-12 mt-16 overflow-hidden text-center md:mt-24 rounded-3xl bg-gradient-to-br from-primary to-primary/90 sm:px-10 sm:py-14 md:py-16"
        >
          {/* Decorative glow accents */}
          <div className="absolute h-56 rounded-full w-[500px] -top-16 -right-16 bg-secondary/20 blur-3xl" />
          <div className="absolute w-[500px] h-56 rounded-full -bottom-16 -left-16 bg-accent/10 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 text-secondaryLight text-[10px] font-bold uppercase tracking-[0.35em] mb-5">
              <span className="w-6 h-px bg-secondaryLight" />
              Our Core Statement
              <span className="w-6 h-px bg-secondaryLight" />
            </span>

            <h3 className="font-heading-sans text-white text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-bold leading-[1.35] tracking-tight max-w-3xl mx-auto">
              A city of <span className="text-secondaryLight">Sanctified People</span>,
              commissioned to raise men whose desire is to be{" "}
              <span className="text-secondaryLight">like Christ</span> upon the
              earth.
            </h3>
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 text-center md:mt-10"
        >
          <p className="text-[10px] text-primary/30 uppercase tracking-[0.3em]">
            Excellence • Effectiveness • Efficiency • Integrity
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PillarsSection;