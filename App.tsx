
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PetDetails from './pages/PetDetails';
import Favorites from './pages/Favorites';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import PersonalInfo from './pages/PersonalInfo';
import MyApplications from './pages/MyApplications';
import ApplicationDetails from './pages/ApplicationDetails';
import VolunteerInfo from './pages/VolunteerInfo';
import ApplicationForm from './pages/ApplicationForm';
import Appointments from './pages/Appointments';
import AiMatches from './pages/AiMatches';
import Intro from './pages/Intro';
import Login from './pages/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AddPet from './admin/AddPet';
import { Pet, AdoptionApplication } from './types';
import { supabase } from './lib/supabase';
import { getPets, getMyApplications, submitApplication, updateApplication, togglePetFavorite } from './lib/api';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { id: 'discover', label: 'Discover', icon: 'pets', path: '/' },
    { id: 'appointments', label: 'Appts', icon: 'calendar_month', path: '/appointments' },
    { id: 'ai-match', label: 'AI Match', icon: 'psychology', path: '/ai-match' },
    { id: 'messages', label: 'Messages', icon: 'chat_bubble', path: '/messages' },
    { id: 'profile', label: 'Profile', icon: 'person', path: '/profile' }
  ];

  const mainPaths = ['/', '/appointments', '/ai-match', '/messages', '/profile'];
  const showNav = mainPaths.includes(currentPath);
  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-20 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const App: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Supabase auth error:', err);
      setIsLoading(false);
    });

    // Fallback timeout to prevent infinite loading if Supabase hangs
    const timeout = setTimeout(() => setIsLoading(false), 2000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    if (!session?.user?.id) return;
    try {
      const [fetchedPets, fetchedApps] = await Promise.all([
        getPets(session.user.id),
        getMyApplications(session.user.id)
      ]);
      setPets(fetchedPets);
      setApplications(fetchedApps);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    if (!session?.user?.id) return;
    const pet = pets.find(p => p.id === id);
    if (!pet) return;

    // Optimistic update
    setPets(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));

    try {
      await togglePetFavorite(id, session.user.id, !pet.isFavorite);
    } catch (error) {
      // Revert on error
      console.error('Error toggling favorite:', error);
      setPets(prev => prev.map(p => p.id === id ? { ...p, isFavorite: pet.isFavorite } : p));
    }
  };

  const handleApply = async (petId: string, formData: any) => {
    if (!session?.user?.id) return;
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    try {
      const newApp = await submitApplication({
        petId: pet.id,
        petName: pet.name,
        petImage: pet.image,
        ...formData
      }, session.user.id);

      setApplications(prev => [newApp, ...prev]);
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const handleUpdateApplication = async (appId: string, formData: any) => {
    try {
      await updateApplication(appId, formData);
      setApplications(prev => prev.map(app =>
        app.id === appId ? { ...app, ...formData } : app
      ));
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Admin Module - Full Screen PC Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddPet />} />
        </Route>

        {/* Mobile Application - Phone Layout */}
        <Route path="*" element={
          <div className="mx-auto max-w-[480px] min-h-screen bg-white shadow-2xl relative overflow-x-hidden">
            <Routes>
              {!session ? (
                <>
                  <Route path="/intro" element={<Intro />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/intro" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Home pets={pets} onToggleFavorite={toggleFavorite} />} />
                  <Route path="/pet/:id" element={<PetDetails pets={pets} onToggleFavorite={toggleFavorite} />} />
                  <Route path="/favorites" element={<Favorites pets={pets} onToggleFavorite={toggleFavorite} />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/ai-match" element={<AiMatches pets={pets} onToggleFavorite={toggleFavorite} />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/profile" element={<Profile applicationCount={applications.length} onLogout={() => supabase.auth.signOut()} />} />
                  <Route path="/profile/info" element={<PersonalInfo />} />
                  <Route path="/profile/applications" element={<MyApplications applications={applications} />} />
                  <Route path="/application/:id" element={<ApplicationDetails applications={applications} />} />
                  <Route path="/profile/volunteer" element={<VolunteerInfo />} />
                  <Route path="/apply/:id" element={<ApplicationForm pets={pets} onApply={handleApply} />} />
                  <Route path="/edit-application/:appId" element={<ApplicationForm pets={pets} applications={applications} onUpdate={handleUpdateApplication} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
            {session && !location.pathname.startsWith('/admin') && <BottomNav />}
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
