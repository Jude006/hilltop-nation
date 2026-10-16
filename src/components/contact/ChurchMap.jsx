import React from 'react';

const ChurchMap = () => {
const mapSource = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.9972332617757!2d3.254811974994064!3d6.706831993288813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b9969972d6257%3A0x6c1d55e753133d1a!2sMayor%20Model%20Nur%2FPri%20School!5e0!3m2!1sen!2sng!4v1713049185000!5m2!1sen!2sng";

  return (
    <div className="w-full h-full relative group overflow-hidden">
      {/* Overlay to dim the map slightly until hover, matching the banner vibes */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none z-10 group-hover:bg-transparent transition-all duration-500" />
      
      <iframe
        title="Church Location Map"
        src={mapSource}
        className="w-full h-full min-h-[500px] grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      {/* Floating Address Card on Map (Optional) */}
      <div className="absolute bottom-8 left-8 z-20 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 hidden md:block max-w-[250px]">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-secondaryLight mb-2">Main Campus</h4>
        <p className="text-xs font-bold text-primary font-albert-sans leading-relaxed">
          123 Glory Avenue, Near the Central Bridge, Lagos State.
        </p>
      </div>
    </div>
  );
};

export default ChurchMap;