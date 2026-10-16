import { motion } from "framer-motion";
import { CreditCard, Landmark } from "lucide-react";

const GivingWays = () => {
  return (
    <section className="relative py-20 overflow-hidden md:py-28 bg-background">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Animated card illustration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative flex justify-center py-10 lg:justify-start"
          >
            <div className="absolute w-64 h-64 rounded-full -top-6 left-10 bg-secondary/20 blur-3xl" />
            <div className="absolute bottom-0 w-56 h-56 rounded-full right-10 bg-accent/20 blur-3xl" />

            {/* Back card */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [6, 9, 6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-64 h-40 sm:w-72 sm:h-44 rounded-2xl bg-gradient-to-br from-accent to-[#a8631a] shadow-xl translate-x-6 translate-y-6"
            />

            {/* Front card */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [-3, -6, -3] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="relative flex flex-col justify-between w-64 h-40 p-5 shadow-2xl sm:w-72 sm:h-44 rounded-2xl bg-gradient-to-br from-secondary to-[#084144]"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase text-secondaryLight font-heading-sans">
                  Hilltop Nation
                </span>
                <CreditCard className="text-white/70" size={22} />
              </div>
              <div className="flex items-center gap-2">
                {["••••", "••••", "••••", "3510"].map((group, i) => (
                  <span
                    key={i}
                    className="text-lg font-medium tracking-widest text-white font-heading-sans"
                  >
                    {group}
                  </span>
                ))}
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[11px] uppercase tracking-wide text-white/60">
                  Kingdom Sacrifice
                </span>
                <div className="flex -space-x-2">
                  <span className="w-6 h-6 rounded-full bg-accent/90" />
                  <span className="w-6 h-6 rounded-full bg-secondaryLight/90" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <Landmark size={18} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-heading-sans">
                Ways to Give
              </span>
            </div>
            <h2 className="mb-6 text-4xl font-black leading-[1.05] tracking-tight uppercase sm:text-5xl lg:text-6xl font-heading-sans text-primary">
              Multiple ways <br /> to give
            </h2>
            <p className="max-w-lg text-base leading-relaxed sm:text-lg text-primary/70 font-albert-sans">
              Give directly through our dedicated ministry account below. Your
              giving supports the work of God, helps us raise Christ
              ambassadors, and empowers us to illuminate the world with His
              truth, love, power, and glory.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GivingWays;