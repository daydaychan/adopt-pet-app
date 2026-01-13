
import React from 'react';
import { useNavigate } from 'react-router-dom';

const VolunteerInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slideInRight">
      <div className="sticky top-0 z-50 bg-white px-5 py-4 border-b border-gray-50 flex items-center">
        <button 
          onClick={() => navigate('/profile')} 
          className="size-10 flex items-center justify-center bg-gray-50 rounded-xl transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-slate-900">chevron_left</span>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg text-slate-900 mr-10">Volunteer Program</h2>
      </div>

      <div className="flex-1 px-5 pt-8 pb-10">
        <div className="aspect-video w-full rounded-[32px] overflow-hidden mb-8 shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1551730459-92db2a308d6a?auto=format&fit=crop&q=80&w=800" 
            alt="Volunteer" 
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-4">Make a difference in a pet's life</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          Not ready to adopt? You can still help! Our volunteer program connects animal lovers with local shelters in need of extra hands.
        </p>

        <div className="space-y-6">
          {[
            { icon: 'walking', title: 'Dog Walking', desc: 'Help energetic dogs get their daily exercise.' },
            { icon: 'hand-heart', title: 'Socialization', desc: 'Spend time with shy cats to help them get ready for adoption.' },
            { icon: 'event', title: 'Events', desc: 'Help us run weekend adoption fairs and donation drives.' },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-background-light rounded-2xl">
              <div className="size-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined">volunteer_activism</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5">
        <button 
          onClick={() => alert('Application form for volunteering sent to your email!')}
          className="w-full h-16 bg-primary text-slate-900 font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Apply to Volunteer
        </button>
      </div>
    </div>
  );
};

export default VolunteerInfo;
