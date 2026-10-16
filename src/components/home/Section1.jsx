import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Users, BookOpen, Crown } from "lucide-react";

const Section1 = () => {
  const cards = [
    {
      label: "Our Identity",
      title: "Who We Are",
      path: "/about",
      image: "/img/HTN6.jpeg",
      icon: <Users size={16} />,
    },
    {
      label: "Our Mandate",
      title: "Christlike Men",
      path: "/about",
      image: "/img/HTN5.jpeg",
      icon: <BookOpen size={16} />,
    },
    {
      label: "Our Assignment",
      title: "Establishing the Kingdom",
      path: "/about",
      image: "/img/HTN7.jpeg",
      icon: <Crown size={16} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="py-24 bg-[#F2F1ED] w-full overflow-hidden font-albert-sans">
      <div className="container px-6 mx-auto md:px-12 lg:px-24">
        {/* --- Header --- */}
        <div className="flex flex-col justify-between gap-8 mb-20 lg:flex-row lg:items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-secondary/40"></span>
              <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">
                Welcome to HTN
              </span>
            </div>
            <h2 className="text-6xl md:text-8xl font-heading-serif text-primary leading-[0.85] tracking-tighter uppercase">
              This is <span className="text-secondary">Home.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pl-6 mb-2 text-sm leading-relaxed border-l-2 lg:max-w-xs text-primary/60 md:text-base border-secondary/20"
          >
            A city of sanctified people — commissioned to raise men whose
            desire is to be like Christ upon the earth.
          </motion.p>
        </div>

        {/* --- Cards Grid --- */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -12 }}
              className="relative cursor-pointer group"
            >
              {/* Image Container */}
              <div className="relative h-[55vh] w-full rounded-[50px_10px_50px_10px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] bg-primary">
                <img
                  src={card.image}
                  alt={card.title}
                  className="object-cover object-center w-full h-full transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80" />

                {/* Vertical Text Accent */}
                <div className="absolute hidden transition-opacity duration-500 -translate-y-1/2 opacity-0 left-6 top-1/2 group-hover:opacity-100 xl:block">
                  <p className="rotate-[-90deg] origin-center text-[8px] font-black text-white/40 tracking-[0.5em] uppercase whitespace-nowrap">
                    HTN • GLOBAL • MINISTRY
                  </p>
                </div>

                {/* Content Layer */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-10">
                  <div className="transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                    <p className="flex items-center gap-2 text-secondaryLight font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                      {card.icon} {card.label}
                    </p>
                    <h3 className="text-4xl leading-tight tracking-tight text-white font-heading-serif">
                      {card.title}
                    </h3>
                  </div>

                  {/* Learn More - Reveal on Hover */}
                  <Link
                    to={card.path}
                    className="flex items-center gap-3 text-white/0 group-hover:text-white transition-all duration-500 font-black uppercase text-[10px] tracking-widest"
                  >
                    <span className="w-0 group-hover:w-8 h-[1px] bg-secondaryLight transition-all duration-500" />
                    Learn More
                    <div className="bg-secondary p-1.5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500">
                      <ArrowUpRight size={14} className="text-white" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Hover Decorative Glow */}
              <div className="absolute -inset-2 bg-secondary/5 rounded-[55px_15px_55px_15px] -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Section1;