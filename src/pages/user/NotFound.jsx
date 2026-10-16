import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect when countdown hits 0
    if (countdown === 0) {
      navigate('/');
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-albert-sans">
      <div className="relative">
        {/* Animated Background Element */}
        <div className="absolute -inset-4 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative text-center">
          <h1 className="text-[120px] md:text-[180px] font-black text-primary leading-none tracking-tighter opacity-10">
            404
          </h1>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-4 animate-bounce">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-tight">
              Lost in the Cloud
            </h2>
          </div>
        </div>
      </div>

      <p className="mt-8 text-primary/40 text-sm md:text-base font-medium max-w-xs text-center leading-relaxed">
        The page you are looking for doesn't exist or has been relocated.
      </p>

      <div className="mt-10 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 px-6 py-3 bg-background rounded-full border border-gray-100">
          <span className="w-2 h-2 bg-secondary rounded-full animate-ping" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
            Redirecting to Home in <span className="text-secondary">{countdown}s</span>
          </p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          <Home size={14} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;