
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  applicationCount: number;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ applicationCount, onLogout }) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
      navigate('/intro');
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const menuItems = [
    { 
      icon: 'person', 
      label: 'Personal Information', 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      onClick: () => navigate('/profile/info')
    },
    { 
      icon: 'assignment', 
      label: 'My Applications', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50', 
      badge: applicationCount > 0 ? applicationCount.toString() : undefined,
      onClick: () => navigate('/profile/applications')
    },
    { 
      icon: 'notifications', 
      label: 'Notifications', 
      color: 'text-amber-500', 
      bg: 'bg-amber-50',
      onClick: () => setIsNotificationsEnabled(!isNotificationsEnabled),
      isToggle: true,
      value: isNotificationsEnabled
    },
    { 
      icon: 'favorite', 
      label: 'Saved Pets', 
      color: 'text-rose-500', 
      bg: 'bg-rose-50',
      onClick: () => navigate('/favorites')
    },
    { 
      icon: 'settings', 
      label: 'App Settings', 
      color: 'text-slate-500', 
      bg: 'bg-slate-50',
      onClick: handleSettingsToggle
    },
    { 
      icon: 'help', 
      label: 'Help & Support', 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50',
      onClick: () => alert('Support: help@pawsconnect.com')
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white animate-fadeIn relative pb-24">
      {/* Header */}
      <div className="bg-primary/10 px-5 pt-12 pb-8 rounded-b-[40px]">
        <div className="flex justify-between items-start">
          <button 
            onClick={handleSettingsToggle}
            className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-slate-700">settings</span>
          </button>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="size-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={() => navigate('/profile/info')}
                className="absolute bottom-0 right-0 size-8 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-md transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-sm font-bold">edit</span>
              </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Jane Cooper</h2>
            <p className="text-sm text-slate-500">Los Angeles, California</p>
          </div>
          <button 
            onClick={handleLogout}
            className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-rose-500">logout</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 -mt-6">
        <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/50 p-6 grid grid-cols-3 divide-x divide-gray-100">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-slate-900">12</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Adopted</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-slate-900">45</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Saved</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-slate-900">{applicationCount}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Active</span>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-5 mt-10 space-y-4 mb-8">
        {menuItems.map((item) => (
          <button 
            key={item.label}
            onClick={item.onClick}
            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100 active:scale-[0.98]"
          >
            <div className={`size-12 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <span className="flex-1 text-left font-bold text-slate-700">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.isToggle ? (
                <div className={`w-10 h-6 rounded-full transition-colors relative ${item.value ? 'bg-primary' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${item.value ? 'left-5' : 'left-1'}`}></div>
                </div>
              ) : (
                <>
                  {item.badge && (
                    <span className="bg-primary text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-slate-400 transition-colors">
                    chevron_right
                  </span>
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Promotion Card */}
      <div className="px-5 mb-10">
        <div className="bg-slate-900 rounded-[28px] p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-white font-bold text-lg">Become a Pet Volunteer</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-[180px]">
              Join our community of animal lovers and help local shelters.
            </p>
            <button 
              onClick={() => navigate('/profile/volunteer')}
              className="mt-4 bg-primary text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-transform active:scale-95"
            >
              Learn More
            </button>
          </div>
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/5 text-[120px] select-none">
            volunteer_activism
          </span>
        </div>
      </div>

      {/* Settings Modal (Slide-up) */}
      {showSettings && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-fadeIn"
            onClick={handleSettingsToggle}
          ></div>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl animate-slideInUp">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">App Settings</h3>
            
            <div className="space-y-6">
              {[
                { label: 'Dark Mode', icon: 'dark_mode', enabled: false },
                { label: 'High Contrast', icon: 'contrast', enabled: false },
                { label: 'Push Notifications', icon: 'notifications_active', enabled: true },
                { label: 'Location Services', icon: 'location_on', enabled: true }
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-background-light rounded-xl flex items-center justify-center text-slate-500">
                      <span className="material-symbols-outlined">{setting.icon}</span>
                    </div>
                    <span className="font-bold text-slate-700">{setting.label}</span>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${setting.enabled ? 'bg-primary' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1.5 size-4 bg-white rounded-full transition-all ${setting.enabled ? 'left-6' : 'left-1.5'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleSettingsToggle}
              className="w-full h-14 bg-slate-900 text-white font-bold rounded-2xl mt-10 transition-transform active:scale-95"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
