import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Target, Compass } from 'lucide-react';

const VisionMission = () => {
  const cards = [
    {
      title: "Our Vision",
      desc: "A city of sanctified people commissioned to raise men whose desire is to be like Christ upon the earth — establishing the Kingdom of our God in every sphere of life, and bringing many into the same growth of their spiritual, physical, marital, and financial lives.",
      icon: <Eye className="w-6 h-6" />,
      delay: 0.1
    },
    {
      title: "Our Mission",
      desc: "To raise Christlike men in character and in every aspect of their lives through impacting services with profound worship and word sessions — building a formidable city of spiritual giants who establish the Kingdom of our God upon the Earth.",
      icon: <Target className="w-6 h-6" />,
      delay: 0.2
    },
    {
      title: "Our Mandate",
      desc: "To bring people into deeper encounters with God through prayer, the Word, and discipleship — raising Christ ambassadors who represent Him effectively in every sphere of life and establish His Kingdom upon the earth.",
      icon: <Compass className="w-6 h-6" />,
      delay: 0.3
    }
  ];

  return (
    <div id="vision-mission" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-6 mb-16 md:flex-row md:items-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <p className="text-secondaryLight font-mono text-[10px] uppercase tracking-[0.5em] mb-4">
            // Purpose &amp; Drive
          </p>
          <h2 className="text-4xl font-bold leading-none tracking-tighter uppercase md:text-5xl text-primary">
            Why We <span className="text-primary/40">Exist.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-xs text-sm italic text-primary/40 font-albert-sans md:text-right"
        >
          "A city of sanctified people commissioned to raise men whose desire is to be like Christ upon the earth."
        </motion.p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: card.delay, duration: 0.6 }}
            className="group relative flex flex-col p-8 sm:p-10 bg-white border border-primary/10 rounded-[32px] sm:rounded-[40px] hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-500"
          >
            {/* Icon Circle */}
            <div className="flex items-center justify-center mb-8 transition-colors duration-500 w-14 h-14 bg-primary/5 rounded-2xl text-primary/40 group-hover:bg-secondaryLight group-hover:text-primary">
              {card.icon}
            </div>

            <h3 className="mb-4 text-xl font-bold tracking-tight uppercase text-primary">
              {card.title}
            </h3>

            <p className="text-sm leading-relaxed text-primary/55 font-albert-sans">
              {card.desc}
            </p>

            {/* Subtle Decorative Number */}
            <span className="absolute text-4xl font-black transition-colors top-8 right-8 sm:top-10 sm:right-10 text-primary/5 group-hover:text-primary/10">
              0{index + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VisionMission;