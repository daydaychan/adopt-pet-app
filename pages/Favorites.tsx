
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet } from '../types';

interface FavoritesProps {
  pets: Pet[];
  onToggleFavorite: (id: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ pets, onToggleFavorite }) => {
  const navigate = useNavigate();
  const favPets = pets.filter(p => p.isFavorite);

  return (
    <div className="flex flex-col min-h-screen bg-white animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className="flex-1 text-center font-bold text-xl text-slate-900 mr-10">My Favorites</h2>
      </div>

      {/* Search */}
      <div className="px-5 mt-6">
        <div className="flex h-12 bg-background-light rounded-2xl items-center px-4 gap-3">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search your favorites" 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 px-5 mt-6">
        {favPets.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-gray-200">heart_broken</span>
            <p className="text-gray-400 font-medium">No favorites yet!</p>
          </div>
        ) : (
          favPets.map((pet) => (
            <div 
              key={pet.id} 
              className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-primary transition-colors cursor-pointer"
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              <div className="size-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 truncate">{pet.name}</h4>
                  {pet.isUrgent && (
                    <span className="bg-rose-100 text-rose-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Urgent</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 font-medium">{pet.breed} • {pet.age}</p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-snug">
                  {pet.description}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(pet.id);
                }}
                className="size-10 flex items-center justify-center text-primary"
              >
                <span className="material-symbols-outlined filled text-2xl">favorite</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
