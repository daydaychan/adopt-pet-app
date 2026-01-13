
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Intro: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-end px-8 pb-16 overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800" 
          alt="Dogs" 
          className="w-full h-full object-cover opacity-60 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="size-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20">
            <span className="material-symbols-outlined text-4xl text-slate-900 filled">pets</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          Find your perfect<br />furry companion
        </h1>
        
        <p className="text-slate-300 text-lg mb-10 max-w-[280px] mx-auto leading-relaxed">
          Adopt a friend and give them a forever home today.
        </p>

        <button 
          onClick={() => navigate('/login')}
          className="w-full h-16 bg-primary hover:bg-emerald-500 text-slate-900 font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
        >
          Get Started
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        
        <p className="mt-8 text-slate-400 text-xs font-medium">
          Already have an account? <button onClick={() => navigate('/login')} className="text-primary font-bold">Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default Intro;
