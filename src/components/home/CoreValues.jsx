import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Crown, Zap } from "lucide-react";

const CoreValues = () => {
  const values = [
    {
      title: "Spiritual Depth",
      subtitle: "The Foundation",
      desc: "Deep-rooted Pentecostal worship and sound biblical teaching to anchor your soul in Christ.",
      icon: <ShieldCheck size={28} className="text-secondaryLight" />,
      color: "bg-primary",
      textColor: "text-white",
      tag: "Spirit",
    },
    {
      title: "Personal Mastery",
      subtitle: "The Mindset",
      desc: "Equipping you with leadership, financial literacy, and mental fortitude to dominate your field.",
      icon: <TrendingUp size={28} className="text-primary" />,
      color: "bg-secondaryLight",
      textColor: "text-primary",
      tag: "Growth",
    },
    {
      title: "Kingdom Authority",
      subtitle: "The Influence",
      desc: "Walking in the power of the Holy Spirit to bring transformation to your community and career.",
      icon: <Crown size={28} className="text-primary" />,
      color: "bg-white",
      textColor: "text-primary",
      tag: "Power",
    },
    {
      title: "Global Excellence",
      subtitle: "The Standard",
      desc: "Raising giants who set the pace in tech, business, and arts with a spirit of excellence.",
      icon: <Zap size={28} className="text-secondaryLight" />,
      color: "bg-overlay",
      textColor: "text-white",
      tag: "Impact",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        {/* Header Section */}
        <div className="flex flex-col justify-center w-full  mb-16 gap-6">
          <div className=" flex flex-col justify-center items-center w-full ">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-6xl font-heading-serif text-primary leading-tight text-center font-bold"
            >
              How we Raise Successful
              <span className="text-secondary font-light text-center">
                {" "}
                <br /> Giants.
              </span>
            </motion.h2>
          </div>
        </div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((v, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className={`${v.color} ${v.textColor} p-8 rounded-3xl flex flex-col justify-between min-h-[380px] shadow-sm hover:shadow-2xl transition-all duration-500 group`}
            >
              <div>
                <div className="flex justify-between items-start mb-12">
                  <div
                    className={`p-4 rounded-2xl ${v.color === "bg-white" ? "bg-background" : "bg-white/10"} transition-colors group-hover:bg-accent  group-hover:text-white`}
                  >
                    {v.icon}
                  </div>
                  <span
                    className={`font-Montserrat text-[10px] tracking-[0.2em] uppercase opacity-40`}
                  >
                    {v.tag}
                  </span>
                </div>

                <p className="text-xs uppercase tracking-widest mb-2 opacity-60 font-bold">
                  {v.subtitle}
                </p>
                <h3 className="text-3xl font-heading-serif mb-4 leading-none">
                  {v.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed opacity-70 font-albert-sans group-hover:opacity-100 transition-opacity">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Success Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-20 p-12 bg-overlay rounded-[40px] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h3 className="text-2xl md:text-3xl font-heading-serif text-secondaryLight italic relative z-10">
            "Your spiritual height determines your horizontal influence."
          </h3>
          <p className="text-white/40 mt-4 font-Montserrat text-xs uppercase tracking-widest">
            — Hilltop Nation Philosophy
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CoreValues;
