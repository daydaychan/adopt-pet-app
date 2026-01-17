
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';

interface PersonalInfoProps {
  user: any;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    location: user?.user_metadata?.location || '',
    bio: user?.user_metadata?.bio || ''
  });

  // Update form data when user prop changes (e.g. on initial load if user was null)
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        location: user.user_metadata?.location || '',
        bio: user.user_metadata?.bio || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: formData.email, // Allow updating email if needed, though usually requires confirmation
        data: {
          full_name: formData.name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio
        }
      });

      if (error) throw error;

      alert('Information updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slideInRight">
      <div className="sticky top-0 z-50 bg-white px-5 py-4 border-b border-gray-50 flex items-center">
        <button
          onClick={() => navigate('/profile')}
          className="size-10 flex items-center justify-center bg-gray-50 rounded-xl transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-slate-900">chevron_left</span>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg text-slate-900 mr-10">Personal Information</h2>
      </div>

      <div className="flex-1 px-5 pt-8 pb-10">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="size-28 rounded-full overflow-hidden border-4 border-primary/20 p-1">
              <img
                src={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button className="absolute bottom-0 right-0 size-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90">
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {[
            { id: 'name', label: 'Full Name', type: 'text', icon: 'person' },
            { id: 'email', label: 'Email Address', type: 'email', icon: 'mail' },
            { id: 'phone', label: 'Phone Number', type: 'tel', icon: 'phone' },
            { id: 'location', label: 'Current Location', type: 'text', icon: 'location_on' },
          ].map((field) => (
            <div key={field.id}>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{field.label}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{field.icon}</span>
                <input
                  type={field.type}
                  value={(formData as any)[field.id]}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  className="w-full h-14 bg-background-light border-none rounded-2xl px-12 text-sm font-medium focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                  disabled={field.id === 'email'} // Disable email editing for simplicity now, or allow it but warn about verify workflow
                />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">About Me</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-background-light border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/50 transition-all resize-none outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-5">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-16 bg-primary text-slate-900 font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <div className="size-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
