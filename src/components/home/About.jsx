import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Crown } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="px-6 py-20 overflow-hidden bg-[#f0f0f0] md:px-12 lg:px-24 font-albert-sans">
      <div className="container mx-auto">
        {/* Top Introduction Section */}
        <div className="max-w-4xl mb-20">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-4xl sm:text-5xl md:text-6xl tracking-tight font-heading-serif text-primary leading-[1.1]"
          >
            Raising Christlike Men,{" "}
            <span className="text-secondary">Establishing His Kingdom</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl text-sm leading-relaxed sm:text-base md:text-lg text-primary/80 font-heading-sans"
          >
            Apostle Chisom Okechukwu is a Father, a man of Precision, a man
            given to prayer, a discipler, a teacher, a prophet, and an Apostle
            to Nations. He is the Global Lead Pastor of Hilltop Nation, with a
            burden to raise Christlike men and establish the Kingdom of our God
            upon the earth.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid items-start grid-cols-1 gap-14 lg:gap-10 lg:grid-cols-2">
          {/* Left Side: Overlapping Images */}
          <div className="relative">
            {/* Vertical Name Text */}
            <div className="absolute hidden -left-12 bottom-20 xl:block">
              <p className="rotate-[-90deg] origin-left text-[10px] font-black font-heading-serif uppercase tracking-[0.5em] text-primary/40 whitespace-nowrap">
                APOSTLE CHISOM OKECHUKWU
              </p>
            </div>

            {/* Large Image Container */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              <div className="rounded-[40px] overflow-hidden shadow-2xl w-full">
                <img
                  src="/img/HTN3.jpeg"
                  alt="Apostle Chisom Okechukwu"
                  className="w-full h-[420px] sm:h-[480px] md:h-[550px] object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-8 -left-4 sm:-left-8 bg-gradient-to-br from-secondary to-accent p-5 sm:p-6 rounded-2xl shadow-xl text-white max-w-[150px] sm:max-w-[160px]">
                <Crown className="mb-3 opacity-80" size={26} />
                <p className="text-[10px] font-Montserrat uppercase tracking-widest font-bold mb-1">
                  Global Lead Pastor
                </p>
                <p className="text-sm font-black leading-tight uppercase">
                  Hilltop Nation
                </p>
              </div>

              {/* Overlapping Smaller Image (Bottom Right) */}
              <div className="absolute -bottom-14 -right-4 md:-right-16 w-2/5 sm:w-1/2 rounded-[30px] border-8 md:border-[12px] border-background overflow-hidden hidden sm:block">
                <img
                  src="/img/HTN6.jpeg"
                  alt="Apostle Chisom Okechukwu in ministry"
                  className="w-full h-[180px] md:h-[250px] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Detailed Biography */}
          <div className="pt-6 space-y-8 lg:pt-10">
            <div className="flex items-center gap-3 text-secondary font-heading-serif text-xs font-black tracking-[0.4em] uppercase">
              <span className="w-8 h-[2px] bg-secondary" /> Our Apostle
            </div>

            <div className="space-y-6 text-base font-medium leading-loose text-primary/80 md:text-lg font-heading-sans">
              <p>
                Apostle C.O Chiom is a man whose dedication and devotion to God
                is real and evident — a teacher par excellence, an Apostle to
                Nations, and a Prophet of God. He is passionate about raising
                Christlike men in character and in every aspect of their lives.
              </p>

              <p>
                From his early years on the campus, he kept maintaining upwards
                growth in his spiritual life and has always been burdened to
                bring many people into the same growth of their spiritual,
                physical, marital, and financial lives.
              </p>

              <p>
                His consistent prayer and study life is seen in the way his
                ministry keeps unfolding as a formidable city of spiritual
                giants. He is married to his dear wife, Rev'd Comfort Chisom,
                and together they have two wonderful boys.
              </p>
            </div>

            {/* Read More Button */}
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 bg-gradient-to-r from-secondary to-accent text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-secondary/20"
              >
                Read More
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:rotate-45"
                />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;