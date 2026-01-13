
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdoptionApplication } from '../types';

interface ApplicationDetailsProps {
  applications: AdoptionApplication[];
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ applications }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const application = applications.find(app => app.id === id);

  if (!application) return <div className="p-10 text-center">Application not found</div>;

  const milestones = [
    { label: 'Submitted', status: 'completed', desc: 'Received by shelter', date: application.date },
    { label: 'Reviewing', status: 'current', desc: 'Shelter is checking your details', date: 'In Progress' },
    { label: 'Interview', status: 'pending', desc: 'Meet & Greet session', date: '--' },
    { label: 'Decision', status: 'pending', desc: 'Final application outcome', date: '--' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slideInRight pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white px-5 py-4 border-b border-gray-50 flex items-center">
        <button 
          onClick={() => navigate('/profile/applications')} 
          className="size-10 flex items-center justify-center bg-gray-50 rounded-xl transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-slate-900">chevron_left</span>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg text-slate-900 mr-10">Application Status</h2>
      </div>

      <div className="px-5 pt-6">
        {/* Pet Summary Card */}
        <div className="bg-slate-900 rounded-[32px] p-6 text-white flex items-center gap-4">
          <div className="size-20 rounded-2xl overflow-hidden border-2 border-white/20">
            <img src={application.petImage} alt={application.petName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{application.petName}</h3>
            <p className="text-slate-400 text-sm">Application ID: {application.id}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <div className="size-1.5 bg-primary rounded-full animate-pulse"></div>
              {application.status}
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-10">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Progress Timeline</h4>
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex gap-6 relative">
                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm ${
                  m.status === 'completed' ? 'bg-emerald-500 text-white' :
                  m.status === 'current' ? 'bg-primary text-slate-900' : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="material-symbols-outlined text-sm font-bold">
                    {m.status === 'completed' ? 'check' : m.status === 'current' ? 'autorenew' : 'hourglass_empty'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h5 className={`font-bold ${m.status === 'pending' ? 'text-gray-300' : 'text-slate-900'}`}>{m.label}</h5>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{m.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submitted Data Summary */}
        <div className="mt-12 space-y-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your Application Info</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background-light rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Home Type</p>
              <p className="font-bold text-slate-900 text-sm">{application.homeType}</p>
            </div>
            <div className="p-4 bg-background-light rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Pets</p>
              <p className="font-bold text-slate-900 text-sm truncate">{application.currentPets || 'None'}</p>
            </div>
          </div>

          <div className="p-4 bg-background-light rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Motivation</p>
            <p className="text-sm text-slate-600 leading-relaxed italic">"{application.reason}"</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-5 bg-white border-t border-gray-100 z-50">
        <button 
          onClick={() => navigate(`/edit-application/${application.id}`)}
          className="w-full h-16 bg-white border-2 border-primary text-slate-900 font-bold rounded-2xl shadow-sm hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">edit_note</span>
          Edit Application
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetails;
