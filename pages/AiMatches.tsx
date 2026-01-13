
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet, UserProfile } from '../types';
import { getSmartMatches } from '../lib/gemini';

interface AiMatchesProps {
  pets: Pet[];
  onToggleFavorite: (id: string) => void;
}

const MOCK_USER: UserProfile = {
  name: 'Jane Cooper',
  bio: 'Active outdoor enthusiast. I hike every weekend and love high-energy dogs.',
  homeType: 'House',
  hasGarden: true,
  activityLevel: 'High',
  hasChildren: false,
  existingPets: 'None'
};

const AiMatches: React.FC<AiMatchesProps> = ({ pets, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [smartMatches, setSmartMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleFetchSmartMatches();
  }, []);

  const handleFetchSmartMatches = async () => {
    setIsLoading(true);
    const matches = await getSmartMatches(pets, MOCK_USER);
    setSmartMatches(matches);
    setIsLoading(false);
  };

  const matchedPets = smartMatches.map(match => {
    const pet = pets.find(p => p.id === match.id);
    return pet ? { ...pet, aiInsight: match.insight, matchPriority: match.matchPriority } : null;
  }).filter(p => p !== null) as (Pet & { aiInsight: string, matchPriority: number })[];

  return (
    <div className="flex flex-col min-h-screen bg-white animate-fadeIn pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-5 py-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Match</h2>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[2px] mt-1 flex items-center gap-1">
             <span className="material-symbols-outlined text-[12px] filled">auto_awesome</span>
             Powered by Gemini
          </p>
        </div>
        <button 
          onClick={handleFetchSmartMatches}
          className="size-10 bg-background-light rounded-xl flex items-center justify-center text-slate-600 active:rotate-180 transition-transform duration-500"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>

      <div className="px-5 mt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin">psychology</span>
              </div>
              <div className="absolute -top-1 -right-1 size-8 bg-slate-900 rounded-full flex items-center justify-center border-4 border-white">
                <span className="material-symbols-outlined text-primary text-xs filled">auto_awesome</span>
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 text-lg">Finding your best friend...</h4>
              <p className="text-sm text-slate-400 mt-1 max-w-[240px]">Gemini is analyzing your profile to find pets that match your lifestyle.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {matchedPets.map((pet, idx) => (
              <div 
                key={pet.id} 
                onClick={() => navigate(`/pet/${pet.id}`)}
                className="relative bg-background-light rounded-[32px] p-5 border border-gray-100 shadow-sm overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
              >
                {/* Ranking Badge */}
                <div className="absolute top-0 right-0 bg-primary px-5 py-2 rounded-bl-3xl font-black text-slate-900 text-sm">
                  #{pet.matchPriority}
                </div>

                <div className="flex gap-5">
                  <div className="size-28 rounded-[24px] overflow-hidden border-4 border-white shadow-md shrink-0">
                    <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0 pt-2">
                    <h4 className="text-xl font-bold text-slate-900">{pet.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{pet.breed} • {pet.age}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {pet.distance} away
                    </p>
                  </div>
                </div>

                <div className="mt-5 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-sm filled">auto_awesome</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Why it's a match</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{pet.aiInsight}"</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                   <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="size-6 bg-emerald-100 border-2 border-white rounded-full flex items-center justify-center">
                           <span className="material-symbols-outlined text-[10px] text-emerald-600 filled">check</span>
                        </div>
                      ))}
                      <span className="text-[10px] font-bold text-emerald-600 ml-4">High Compatibility</span>
                   </div>
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(pet.id);
                    }}
                    className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-500 active:scale-90 transition-transform"
                   >
                     <span className={`material-symbols-outlined ${pet.isFavorite ? 'filled' : ''}`}>favorite</span>
                   </button>
                </div>
              </div>
            ))}

            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden mt-10">
               <div className="relative z-10">
                  <h4 className="text-xl font-bold">Refine your results?</h4>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-[200px]">
                    Updating your bio in settings helps Gemini find even better companions for you.
                  </p>
                  <button 
                    onClick={() => navigate('/profile/info')}
                    className="mt-6 bg-primary text-slate-900 font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-widest transition-transform active:scale-95"
                  >
                    Update Profile
                  </button>
               </div>
               <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-white/5 text-[200px] select-none">
                  psychology
               </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMatches;
