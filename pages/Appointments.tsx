
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Appointments: React.FC = () => {
  const navigate = useNavigate();

  const appointments = [
    {
      id: 'apt1',
      petName: 'Buddy',
      petImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQsnFNbF-qMlVJWKk63dBuDVKyOB0eJQ6A73aPNlVfPaSbj1g4qCh4ajsPAEMgWPlJUKgVqv6veXuk5ndfhM2FXaKwBH9NBe359SldRpQsk5MnZuVzxD6d1_4oHl1Bz8jo884OOgTJZILf2o83q8KCvR1IKT23PV2t0yaIfDCEchl4lcM0s5fhOFkgq9wZJz0JGT8yGuzfYGW7ke9YMdjHP9gQL1a3A5d8g4h3A3FGHqF2P7PvSE2DurURpWYP-WFvqdH4hDWYC_-m',
      date: 'Oct 24, 2024',
      time: '14:30',
      type: 'Meet & Greet',
      status: 'Confirmed',
      shelter: 'North Shore Animal League'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white animate-fadeIn pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-5 py-6 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Scheduled Visits</p>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {appointments.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center opacity-40">
            <span className="material-symbols-outlined text-6xl">event_busy</span>
            <p className="font-bold mt-4">No upcoming appointments</p>
            <button onClick={() => navigate('/')} className="text-primary font-bold mt-2 underline">Browse pets</button>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-background-light rounded-[32px] p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="flex items-start gap-4">
                <div className="size-20 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                  <img src={apt.petImage} alt={apt.petName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-lg">Visit {apt.petName}</h4>
                    <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{apt.type}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{apt.shelter}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-200/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  <span className="text-sm font-bold text-slate-900">{apt.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <span className="text-sm font-bold text-slate-900">{apt.time}</span>
                </div>
              </div>

              <button className="absolute bottom-0 right-0 p-3 text-gray-300 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Suggestion Card */}
      <div className="px-5 mt-8">
        <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold text-lg">Meeting Tips</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-[200px]">
              Remember to bring comfortable shoes and any family members who live with you!
            </p>
          </div>
          <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-white/5 text-[140px] select-none">
            lightbulb
          </span>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
