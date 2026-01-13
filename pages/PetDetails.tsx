
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet, UserProfile } from '../types';
import { analyzeCompatibility } from '../lib/gemini';

interface PetDetailsProps {
  pets: Pet[];
  onToggleFavorite: (id: string) => void;
}

const MOCK_USER: UserProfile = {
  name: 'Jane Cooper',
  bio: 'Active outdoor enthusiast. I hike every weekend and love high-energy dogs. I live in a house with a large backyard.',
  homeType: 'House',
  hasGarden: true,
  activityLevel: 'High',
  hasChildren: false,
  existingPets: 'None'
};

const PetDetails: React.FC<PetDetailsProps> = ({ pets, onToggleFavorite }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pet = pets.find(p => p.id === id);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (pet) {
      handleGetAiInsight();
    }
  }, [pet?.id]);

  const handleGetAiInsight = async () => {
    if (!pet) return;
    setIsAiLoading(true);
    const analysis = await analyzeCompatibility(pet, MOCK_USER);
    setAiAnalysis(analysis);
    setIsAiLoading(false);
  };

  if (!pet) return <div className="p-10 text-center">Pet not found</div>;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Adopt ${pet.name}!`,
          text: `Check out this amazing ${pet.breed} named ${pet.name} available for adoption!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleMessage = () => {
    navigate('/messages', { state: { petName: pet.name, shelterId: 'NSAL' } });
  };

  return (
    <div className="bg-white min-h-screen relative pb-32 animate-slideInRight">
      {/* Hero Header */}
      <div className="relative h-[440px] w-full">
        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
        
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="size-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-sm transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => onToggleFavorite(pet.id)}
              className="size-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
            >
              <span className={`material-symbols-outlined text-rose-500 ${pet.isFavorite ? 'filled' : ''}`}>
                favorite
              </span>
            </button>
            <button 
              onClick={handleShare}
              className="size-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-sm transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="h-1.5 w-4 bg-primary rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-white/50 rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-6 bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-[-4px_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{pet.name}</h1>
            <p className="flex items-center gap-1 text-gray-500 mt-1 text-sm">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {pet.breed} • {pet.location}
            </p>
          </div>
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Available
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="mt-8">
          <div className={`p-6 rounded-[32px] transition-all duration-700 ${isAiLoading ? 'bg-gray-50 animate-pulse' : 'bg-slate-900 shadow-xl shadow-slate-200'}`}>
            {isAiLoading ? (
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-primary animate-spin">psychology</span>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Calculating Compatibility...</p>
              </div>
            ) : aiAnalysis ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary filled">auto_awesome</span>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">AI Match Analysis</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-primary">{aiAnalysis.score}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Match</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{aiAnalysis.reason}"</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {aiAnalysis.strengths?.slice(0, 2).map((s: string) => (
                    <div key={s} className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                      + {s}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <button onClick={handleGetAiInsight} className="text-xs font-bold text-primary uppercase underline">Retry AI analysis</button>
              </div>
            )}
          </div>
        </div>

        {/* Traits Chips */}
        <div className="flex gap-4 mt-8 overflow-x-auto no-scrollbar">
          {[
            { icon: 'male', label: pet.gender },
            { icon: 'calendar_today', label: pet.age },
            { icon: 'fitness_center', label: pet.weight },
          ].map((trait) => (
            <div key={trait.label} className="flex h-14 shrink-0 items-center gap-3 bg-background-light px-5 rounded-2xl min-w-[120px]">
              <span className="material-symbols-outlined text-primary">{trait.icon}</span>
              <span className="font-bold text-slate-900 text-sm">{trait.label}</span>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Story</h2>
          <p className="mt-3 text-slate-600 leading-relaxed text-sm">
            {pet.description}
          </p>
        </div>

        {/* Health Status */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Health Status</h2>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {['Vaccinated', 'Neutered', 'Microchipped', 'Dewormed'].map((status) => (
              <div key={status} className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl">
                <span className="material-symbols-outlined text-primary filled text-xl">check_circle</span>
                <span className="text-sm font-semibold text-slate-700">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-5 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50">
        <div className="flex gap-4">
          <button 
            onClick={handleMessage}
            className="h-14 w-14 bg-background-light rounded-2xl flex items-center justify-center text-slate-600 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <button 
            onClick={() => navigate(`/apply/${pet.id}`)}
            className="flex-1 h-14 bg-primary hover:bg-emerald-500 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">pets</span>
            Adopt Me
          </button>
        </div>
        <div className="h-2"></div>
      </div>
    </div>
  );
};

export default PetDetails;
