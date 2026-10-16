import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Button from "../ui/Button";

const MinistriesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className="py-24 bg-[#f0f0f0] w-full overflow-hidden">
      <motion.div
        className="container px-6 mx-auto md:px-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col items-center justify-between gap-16 md:flex-row">
          {/* Left Text Content */}
          <motion.div
            variants={itemVariants}
            className="flex-1 max-w-xl text-center md:text-left"
          >
            <h4 className="text-[10px] md:text-xs font-black uppercase font-Montserrat tracking-[0.5em] text-black/50 mb-2">
              Ministries
            </h4>
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-black font-heading-sans tracking-tighter text-black leading-[0.9] mb-8">
              HILLTOP NATION,{" "}
              <span className="block text-primary">A CITY FOR EVERYONE</span>
            </h1>
            <p className="max-w-lg mb-12 text-lg font-light leading-relaxed md:text-xl font-albert-sans text-black/70">
              From our vibrant youth to our grounded adults, every person has a
              divine assignment. Discover where you fit in and step into your
              God-given purpose with us.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/about">
                <Button
                  text="See All Ministries"
                  bgColor="bg-black"
                  textColor="text-white font-bold uppercase flex items-center gap-2 font-albert-sans text-xs"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image Grid */}
          <motion.div
            variants={itemVariants}
            className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-[25px]"
          >
            {/* Youth Card */}
            <motion.div
              whileHover={{ y: -10 }}
              className="relative cursor-pointer group"
            >
              <div className="overflow-hidden rounded-xl h-[50vh]">
                <img
                  src="/img/HTN4.jpeg"
                  alt="HTN Youth Ministry"
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-secondaryLight font-bold uppercase tracking-widest text-[10px]">
                    The Next Generation
                  </p>
                  <h3 className="text-3xl font-black tracking-tighter text-white font-heading-sans">
                    HTN Youth &amp; Teens
                  </h3>
                </div>

                {/* Bottom Link Reveal */}
                <Link
                  to="/youth"
                  className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 mt-4 font-bold uppercase text-[10px] tracking-widest"
                >
                  Learn More{" "}
                  <ArrowUpRight size={14} className="text-secondaryLight" />
                </Link>
              </div>
            </motion.div>

            {/* Adult Card */}
            <motion.div
              whileHover={{ y: -10 }}
              className="relative mt-0 cursor-pointer group sm:mt-12"
            >
              <div className="overflow-hidden rounded-xl h-[50vh]">
                <img
                  src="/img/HTN8.jpeg"
                  alt="HTN Adult Ministry"
                  className="object-cover object-top w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-secondaryLight font-bold uppercase tracking-widest text-[10px]">
                    Raising Christlike Men
                  </p>
                  <h3 className="text-3xl font-black tracking-tighter text-white font-heading-sans">
                    Established Adults
                  </h3>
                </div>

                {/* Bottom Link Reveal */}
                <Link
                  to="/adults"
                  className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 mt-4 font-bold uppercase text-[10px] tracking-widest"
                >
                  Learn More{" "}
                  <ArrowUpRight size={14} className="text-secondaryLight" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default MinistriesSection;