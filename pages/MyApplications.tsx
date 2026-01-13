
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdoptionApplication } from '../types';

interface MyApplicationsProps {
  applications: AdoptionApplication[];
}

const MyApplications: React.FC<MyApplicationsProps> = ({ applications }) => {
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
        <h2 className="flex-1 text-center font-bold text-lg text-slate-900 mr-10">My Applications</h2>
      </div>

      <div className="flex-1 px-5 pt-6 pb-10">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 opacity-50">
            <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-gray-400">assignment_late</span>
            </div>
            <p className="font-bold text-slate-400">No applications found</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 text-primary font-bold border-b-2 border-primary"
            >
              Discover pets now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id} 
                onClick={() => navigate(`/application/${app.id}`)}
                className="bg-background-light rounded-3xl p-4 flex gap-4 items-center border border-gray-100 active:scale-[0.98] transition-all cursor-pointer hover:border-primary/20"
              >
                <div className="size-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-white">
                  <img src={app.petImage} alt={app.petName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 truncate">Adopting {app.petName}</h3>
                    <span className="text-[10px] text-gray-400 font-bold">{app.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Application ID: {app.id}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{app.status}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
              </div>
            ))}
            
            <div className="mt-10 p-6 bg-primary/10 rounded-[32px] border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary filled">info</span>
                <h4 className="font-bold text-slate-900">Track your progress</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click on any application to see detailed progress and the information you submitted to the shelter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
