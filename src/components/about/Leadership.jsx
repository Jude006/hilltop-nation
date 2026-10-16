import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Globe, BookOpen, Users2 } from 'lucide-react';

const Leadership = () => {
  const navigate = useNavigate();

  const pillars = [
    { 
      title: "Spiritual Growth", 
      desc: "Deepening your walk with God through structured discipleship.", 
      icon: <Flame size={24} />,
      id: "01" 
    },
    { 
      title: "Global Missions", 
      desc: "Spreading the message of the Kingdom beyond borders.", 
      icon: <Globe size={24} />,
      id: "02" 
    },
    { 
      title: "Word Study", 
      desc: "Uncompromising teaching of the scriptures for daily living.", 
      icon: <BookOpen size={24} />,
      id: "03" 
    },
    { 
      title: "Family Center", 
      desc: "A place where every generation finds a home and a purpose.", 
      icon: <Users2 size={24} />,
      id: "04" 
    },
  ];

  return (
    <div className="w-full">
      {/* 1. The Pillars Grid - Minimal & Architectural */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
        {pillars.map((pillar, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white p-10 md:p-16 hover:bg-slate-50 transition-colors duration-500"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-secondaryLight group-hover:text-slate-900 transition-all duration-500">
                {pillar.icon}
              </div>
              <span className="text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                {pillar.id}
              </span>
            </div>

            <h4 className="text-xl font-bold uppercase tracking-tighter text-slate-900 mb-4">
              {pillar.title}
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed font-albert-sans max-w-xs">
              {pillar.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 2. The Final "Contact Us" CTA - Massive & Neat */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32 p-12 md:p-24 bg-slate-900 rounded-[60px] relative overflow-hidden text-center"
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondaryLight/5 blur-[120px] -ml-48 -mt-48"></div>

        <p className="text-secondaryLight font-mono text-[10px] uppercase tracking-[0.5em] mb-8">
          // Start Your Journey
        </p>
        
        <h3 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none mb-10">
          Become part of <br /> <span className="text-secondaryLight">The Story.</span>
        </h3>
        
        <p className="text-white/40 text-sm md:text-lg font-light font-albert-sans max-w-xl mx-auto mb-12 leading-relaxed">
          We believe everyone has a unique place in the house of God. 
          Reach out today and discover where you belong.
        </p>

        <button 
          onClick={() => navigate('/contact')}
          className="group relative inline-flex items-center gap-6 px-12 py-5 bg-white hover:bg-secondaryLight rounded-full transition-all duration-500 shadow-xl hover:shadow-secondaryLight/20"
        >
          <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
            Contact Us Now
          </span>
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:bg-black transition-colors">
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </motion.div>
    </div>
  );
};

export default Leadership;