import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';
// Using your secure API wrapper
import { apiRequest } from '../../lib/api'; 

const BASE_URL = "http://localhost:5000"; 

const UpcomingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        // Fetching data from your existing backend route
        const data = await apiRequest('/programs', 'GET', null, false);
        setPrograms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading programs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // Helper function to format the date for the design (e.g., "24" and "APR")
  const formatEventDate = (dateString) => {
    const d = new Date(dateString);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  return (
    <section className="py-24 bg-[#F2F1ED] px-6 md:px-12 lg:px-24 font-albert-sans overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="h-[1px] w-12 bg-secondary/40"></span>
              <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">
                Mark Your Calendar
              </span>
            </div>
            <h2 className="mb-2 text-5xl tracking-tighter uppercase md:text-6xl font-heading-serif text-primary">
              Upcoming <span className="text-secondary">Programs.</span>
            </h2>
          </motion.div>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 animate-spin text-secondary" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching Events...</p>
          </div>
        ) : programs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {programs.slice(0, 3).map((event, index) => {
              const { day, month } = formatEventDate(event.date);
              
              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-[40px_10px_40px_10px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full"
                >
                  {/* Top Image Area */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img 
                      src={event.flierUrl ? `${BASE_URL}${event.flierUrl}` : "/img/placeholder.jpg"} 
                      alt={event.title} 
                      className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" 
                    />
                    
                    {/* Floating Date Badge */}
                    <div className="absolute z-10 px-4 py-3 text-center text-white shadow-lg top-5 left-5 bg-secondary rounded-2xl">
                      <p className="text-xl font-black leading-none">{day}</p>
                      <p className="text-[9px] font-bold tracking-widest uppercase">{month}</p>
                    </div>

                    {/* Category Label (Using description or a default since category isn't in your schema yet) */}
                    <div className="absolute z-10 bottom-5 right-5">
                       <span className="text-[9px] font-black uppercase tracking-widest text-white bg-primary/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                          {event.title.includes("Prayer") ? "Service" : "Special Event"}
                        </span>
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="flex flex-col justify-between flex-grow p-8">
                    <div>
                      <h3 className="h-16 mb-6 text-2xl leading-tight transition-colors font-heading-serif text-primary group-hover:text-secondary line-clamp-2">
                        {event.title}
                      </h3>

                      <div className="mb-8 space-y-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-primary/60">
                          <Clock size={16} className="text-secondary" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-primary/60">
                          <MapPin size={16} className="text-secondary" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Link */}
                    <motion.button
                      className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-widest group/btn pt-4 border-t border-secondary/10"
                    >
                      Join Service 
                      <div className="p-2 transition-all border rounded-full border-primary/10 group-hover/btn:bg-secondary group-hover/btn:border-secondary">
                        <ArrowRight size={12} className="group-hover/btn:text-white" />
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-secondary/10 rounded-[40px]">
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">No Programs Currently Scheduled</p>
          </div>
        )}

        {/* --- Decorative Line --- */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "100%", opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-[1px] bg-secondary/10 mt-20 mx-auto"
        />
      </div>
    </section>
  );
};

export default UpcomingPrograms;