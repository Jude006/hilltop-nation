import React from "react";
import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";

const schedules = [
  
  {
    day: "Wednesdays",
    title: "Deep Unto Deep",
    time: "05:30 PM",
  },
  {
    day: "October 19",
    title: "Daddy's Birthday Celebration",
    time: "Special Event",
  },
  {
    day: "December 26",
    title: "YGOL — Yearly Gathering Of Light",
    time: "Annual Gathering",
  },
];

const ServiceSchedule = () => {
  return (
    <section
      id="service-schedule"
      className="relative px-6 py-20 mb-10 overflow-hidden bg-primary md:px-16 md:py-28"
    >
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondaryLight/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="container relative z-10 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col justify-between gap-6 mb-12 md:flex-row md:items-end md:gap-10"
        >
          <div>
            <h3 className="text-secondaryLight font-albert-sans text-xs uppercase tracking-[0.4em] mb-4">
              // When to visit
            </h3>
            <h2 className="text-4xl leading-none tracking-tighter text-white uppercase sm:text-5xl md:text-6xl font-heading-sans">
              Weekly <span className="opacity-30">Encounters</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/50 font-albert-sans">
            Join us in any of our weekly meetings and experience the tangible
            presence of God.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {schedules.map((item, index) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-7 sm:p-8 transition-all duration-300 border rounded-3xl bg-white/5 border-white/10 backdrop-blur-md hover:border-secondaryLight/50 hover:bg-white/[0.07] hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-secondaryLight font-black text-[10px] uppercase tracking-widest">
                  {item.day}
                </span>
                <span className="flex items-center justify-center transition-colors duration-300 rounded-full w-9 h-9 bg-white/5 group-hover:bg-secondaryLight/15">
                  <Clock3
                    size={17}
                    className="transition-colors duration-300 text-white/30 group-hover:text-secondaryLight"
                  />
                </span>
              </div>
              <h4 className="mb-2 text-xl font-bold leading-snug text-white font-albert-sans">
                {item.title}
              </h4>
              <p className="text-sm tracking-tight text-white/60 font-albert-sans">
                {item.time}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSchedule;