
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet, UserProfile } from '../types';
import { getSmartMatches } from '../lib/gemini';

interface HomeProps {
  pets: Pet[];
  onToggleFavorite: (id: string) => void;
}

interface FilterState {
  genders: string[];
  ages: string[];
  distance: number;
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

const LOCATIONS = ["Los Angeles, CA", "San Francisco, CA", "New York, NY", "Austin, TX", "Chicago, IL", "Miami, FL"];

const Home: React.FC<HomeProps> = ({ pets, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Dogs');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmartMatch, setIsSmartMatch] = useState(false);
  const [smartMatches, setSmartMatches] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  
  // Filter Modal State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>({
    genders: [],
    ages: [],
    distance: 10
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    genders: [],
    ages: [],
    distance: 50
  });

  const categories = [
    { name: 'Dogs', icon: 'pets' },
    { name: 'Cats', icon: 'cat' },
    { name: 'Birds', icon: 'flutter_dash' },
    { name: 'Other', icon: 'animation' }
  ];

  useEffect(() => {
    if (isSmartMatch && smartMatches.length === 0) {
      handleFetchSmartMatches();
    }
  }, [isSmartMatch]);

  const handleFetchSmartMatches = async () => {
    setIsAiLoading(true);
    const matches = await getSmartMatches(pets, MOCK_USER);
    setSmartMatches(matches);
    setIsAiLoading(false);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGpsLoading(false);
        // In a real app, you'd use reverse geocoding to get the city name.
        // For this demo, we'll just set it to a "detected" state.
        setSelectedLocation("Current Location");
        setIsLocationOpen(false);
      },
      (error) => {
        setIsGpsLoading(false);
        console.error("GPS Error:", error);
        alert("Unable to retrieve your location. Please check your permissions.");
      }
    );
  };

  const filteredPets = useMemo(() => {
    return pets
      .filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.breed.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGender = appliedFilters.genders.length === 0 || appliedFilters.genders.includes(p.gender);
        
        const matchesAge = appliedFilters.ages.length === 0 || appliedFilters.ages.some(ageLabel => {
          if (ageLabel === 'Puppy' && p.age.toLowerCase().includes('month')) return true;
          if (ageLabel === 'Adult' && p.age.toLowerCase().includes('year') && parseInt(p.age) >= 1 && parseInt(p.age) < 7) return true;
          if (ageLabel === 'Senior' && parseInt(p.age) >= 7) return true;
          return false;
        });

        return matchesCategory && matchesSearch && matchesGender && matchesAge;
      })
      .sort((a, b) => {
        if (!isSmartMatch) return 0;
        const aMatch = smartMatches.find(m => m.id === a.id);
        const bMatch = smartMatches.find(m => m.id === b.id);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
  }, [pets, activeCategory, searchQuery, appliedFilters, isSmartMatch, smartMatches]);

  const toggleFilter = (type: 'genders' | 'ages', value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(v => v !== value) 
        : [...prev[type], value]
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    const empty = { genders: [], ages: [], distance: 10 };
    setTempFilters(empty);
    setAppliedFilters(empty);
  };

  return (
    <div className="flex flex-col animate-fadeIn pb-24 min-h-screen bg-white">
      {/* Header */}
      <header className="px-5 pt-6 flex justify-between items-center relative z-[100]">
        <button 
          onClick={handleUseGPS}
          className="bg-background-light p-2.5 rounded-2xl text-slate-900 flex items-center justify-center border border-gray-100 shadow-sm active:scale-90 transition-all"
          title="Use current location"
        >
          <span className={`material-symbols-outlined text-2xl ${isGpsLoading ? 'animate-spin' : 'filled'}`}>
            {isGpsLoading ? 'sync' : 'my_location'}
          </span>
        </button>
        
        <div className="flex flex-col items-center relative">
          <button 
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-1 group active:scale-95 transition-transform"
          >
            <span className="text-sm font-bold text-slate-900">Pet Discovery</span>
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-lg">
              {isLocationOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter -mt-0.5">{selectedLocation}</p>
          
          {isLocationOpen && (
            <>
              <div 
                className="fixed inset-0 z-[101]" 
                onClick={() => setIsLocationOpen(false)}
              ></div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-56 bg-white border border-gray-100 rounded-3xl shadow-2xl py-3 z-[102] animate-slideInDown overflow-hidden">
                <p className="px-5 py-2 text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Select Location</p>
                <div className="max-h-48 overflow-y-auto no-scrollbar">
                  <button
                    onClick={handleUseGPS}
                    className="w-full px-5 py-3 text-left text-xs font-bold transition-all flex items-center gap-2 text-primary hover:bg-primary/5"
                  >
                    <span className="material-symbols-outlined text-sm">my_location</span>
                    Use GPS
                  </button>
                  <div className="h-px bg-gray-50 my-1 mx-4"></div>
                  {LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full px-5 py-3 text-left text-xs font-bold transition-all flex items-center justify-between ${
                        selectedLocation === loc 
                          ? 'text-primary bg-primary/5 border-l-4 border-primary' 
                          : 'text-slate-600 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      {loc}
                      {selectedLocation === loc && <span className="material-symbols-outlined text-sm">check</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div 
          onClick={() => navigate('/favorites')}
          className="bg-background-light p-2.5 rounded-2xl cursor-pointer active:scale-95 transition-transform border border-gray-100 shadow-sm"
        >
          <span className="material-symbols-outlined text-slate-900">favorite</span>
        </div>
      </header>

      {/* Hero Heading Section (Cleaned up as per user request to delete) */}
      <div className="h-4"></div>

      {/* Search & Filter */}
      <div className="px-5 mt-2 flex gap-3">
        <div className="flex-1 h-14 bg-background-light rounded-2xl flex items-center px-4 gap-3">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="Search by breed or name"
            className="bg-transparent border-none focus:ring-0 text-slate-900 w-full placeholder:text-gray-400 outline-none font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => {
            setTempFilters(appliedFilters);
            setIsFilterOpen(true);
          }}
          className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
            appliedFilters.genders.length > 0 || appliedFilters.ages.length > 0
              ? 'bg-slate-900 text-primary'
              : 'bg-primary text-slate-900'
          } shadow-sm`}
        >
          <span className="material-symbols-outlined">tune</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 px-5 mt-6 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex h-12 shrink-0 items-center gap-2 px-6 rounded-2xl transition-all duration-300 active:scale-95 ${
              activeCategory === cat.name 
                ? 'bg-primary text-slate-900 font-bold shadow-md' 
                : 'bg-background-light text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Nearby Section */}
      <div className="px-5 mt-8 flex justify-between items-end">
        <h3 className="text-xl font-bold text-slate-900">
          Nearby for adoption
        </h3>
        <button className="text-primary font-bold text-sm hover:underline">See all</button>
      </div>

      <div className="grid grid-cols-2 gap-4 px-5 mt-4">
        {filteredPets.length > 0 ? filteredPets.map((pet) => {
          return (
            <div 
              key={pet.id} 
              className="group cursor-pointer active:scale-[0.98] transition-all"
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-sm">
                <img 
                  src={pet.image} 
                  alt={pet.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(pet.id);
                  }}
                  className="absolute top-3 right-3 size-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
                >
                  <span className={`material-symbols-outlined text-rose-500 ${pet.isFavorite ? 'filled' : ''}`}>
                    favorite
                  </span>
                </button>

                {pet.isNew && (
                  <div className="absolute bottom-3 left-3 bg-primary text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider text-slate-900 shadow-sm">
                    NEW
                  </div>
                )}
                {pet.isUrgent && (
                  <div className="absolute bottom-3 left-3 bg-[#fde047] text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider text-slate-900 shadow-sm border border-yellow-400">
                    URGENT
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-lg text-slate-900 leading-none group-hover:text-primary transition-colors">{pet.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{pet.age} • {pet.distance}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">{pet.breed}</p>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-2 py-20 text-center flex flex-col items-center opacity-40">
            <span className="material-symbols-outlined text-6xl">search_off</span>
            <p className="font-bold mt-4">No pets match your filters</p>
            <button onClick={resetFilters} className="text-primary font-bold mt-2 underline">Reset all filters</button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] animate-fadeIn"
            onClick={() => setIsFilterOpen(false)}
          ></div>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[40px] p-8 z-[120] shadow-2xl animate-slideInUp">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Filters</h3>
              <button onClick={resetFilters} className="text-sm font-bold text-primary">Reset</button>
            </div>
            
            <div className="space-y-8">
              {/* Gender Filter */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Gender</h4>
                <div className="flex gap-3">
                  {['Male', 'Female'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => toggleFilter('genders', gender)}
                      className={`flex-1 h-12 rounded-2xl font-bold text-sm transition-all border-2 ${
                        tempFilters.genders.includes(gender)
                          ? 'bg-primary border-primary text-slate-900'
                          : 'bg-white border-gray-100 text-slate-500'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Filter */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Age Range</h4>
                <div className="flex flex-wrap gap-3">
                  {['Puppy', 'Adult', 'Senior'].map((age) => (
                    <button
                      key={age}
                      onClick={() => toggleFilter('ages', age)}
                      className={`px-6 h-12 rounded-2xl font-bold text-sm transition-all border-2 ${
                        tempFilters.ages.includes(age)
                          ? 'bg-primary border-primary text-slate-900'
                          : 'bg-white border-gray-100 text-slate-500'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Max Distance</h4>
                  <span className="text-sm font-bold text-slate-900">{tempFilters.distance} miles</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5"
                  value={tempFilters.distance}
                  onChange={(e) => setTempFilters({...tempFilters, distance: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <button 
              onClick={applyFilters}
              className="w-full h-16 bg-slate-900 text-primary font-bold rounded-[24px] mt-10 transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              Apply Filters
              <span className="material-symbols-outlined text-sm">done_all</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
