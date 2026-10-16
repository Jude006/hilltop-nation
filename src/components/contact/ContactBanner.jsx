import React from "react";
import { motion } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { MessageCircle } from "lucide-react";

const ContactBanner = () => {
  const [text] = useTypewriter({
    words: ["Reach Out", "Connect", "Find Peace"],
    loop: 0,
    typeSpeed: 80,
    deleteSpeed: 50,
  });

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-[0px] md:rounded-[50px] shadow-2xl shadow-black/10">
      {/* Background Image with optimized overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/choir1.jpeg"
          className="object-cover object-top w-full h-full transition-all duration-1000 opacity-40 grayscale hover:grayscale-0"
          alt="Contact Hilltop Nation"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="container relative z-10 flex flex-col justify-center h-full px-8 mx-auto md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Section Indicator */}
          <p className="text-secondaryLight/90 font-Montserrat text-xs uppercase tracking-[0.5em] mb-4">
            // Get In Touch
          </p>

          {/* Typewriter Heading */}
          <div className="flex items-center gap-0">
            <h1 className="text-white text-5xl md:text-[100px] font-heading-sans leading-none tracking-tighter">
              Ready to <span className="text-secondaryLight/90">{text}</span>
            </h1>
            {/* Pulsing Cursor bar */}
            <div className="w-[3px] h-[40px] md:h-[80px] bg-white ml-2 mt-2 animate-pulse" />
          </div>

          {/* Description */}
          <p className="max-w-md mt-8 text-sm font-light leading-relaxed text-white/70 md:text-lg font-albert-sans">
            Have a question, a prayer request, or just want to say hello? Our
            doors and hearts are always open to you.
          </p>

          {/* Breadcrumb style indicator */}
          <div className="flex items-center gap-4 mt-12">
            <div className="px-4 py-2 border rounded-full border-white/20 bg-white/5 backdrop-blur-sm">
              <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <MessageCircle size={14} className="text-secondaryLight" />
                Support Center
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Bottom Line */}
      <div className="absolute left-0 z-20 hidden w-full px-16 bottom-12 md:block">
        <div className="w-full h-[1px] bg-white/5 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondaryLight/50 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;
