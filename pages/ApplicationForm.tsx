
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet, AdoptionApplication } from '../types';

interface ApplicationFormProps {
  pets: Pet[];
  onApply?: (petId: string, formData: any) => Promise<void> | void;
  onUpdate?: (appId: string, formData: any) => Promise<void> | void;
  applications?: AdoptionApplication[];
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ pets, onApply, onUpdate, applications }) => {
  const { id, appId } = useParams<{ id?: string; appId?: string }>();
  const navigate = useNavigate();

  // Find current pet either from direct ID or from existing application
  const existingApp = applications?.find(app => app.id === appId);
  const currentPetId = id || existingApp?.petId;
  const pet = pets.find(p => p.id === currentPetId);

  const [formData, setFormData] = useState({
    homeType: 'House',
    landlordName: '',
    currentPets: '',
    reason: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (existingApp) {
      setFormData({
        homeType: existingApp.homeType,
        landlordName: existingApp.landlordName || '',
        currentPets: existingApp.currentPets,
        reason: existingApp.reason
      });
    }
  }, [existingApp]);

  if (!pet) return <div className="p-10 text-center">Pet not found</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("You must agree to the adoption terms and conditions.");
      return;
    }

    setIsLoading(true);

    try {
      if (appId && onUpdate) {
        await onUpdate(appId, formData);
        alert('Application updated successfully!');
        navigate(`/application/${appId}`);
      } else if (pet.id && onApply) {
        await onApply(pet.id, formData);
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 animate-fadeIn text-center">
        <div className="relative mb-8">
          <div className="size-32 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="size-24 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
              <span className="material-symbols-outlined text-slate-900 text-5xl font-bold">check</span>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 size-10 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-md animate-bounce">
            <span className="material-symbols-outlined text-sm font-bold">celebration</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900">Application Sent!</h2>
        <p className="mt-4 text-slate-500 leading-relaxed">
          Your application for <span className="text-slate-900 font-bold">{pet.name}</span> has been successfully submitted to North Shore Animal League.
        </p>

        <div className="mt-10 p-5 bg-background-light rounded-[24px] w-full border border-gray-100">
          <div className="flex items-center gap-3 text-left">
            <div className="size-12 rounded-xl overflow-hidden shrink-0 border border-white shadow-sm">
              <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Application Created</p>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Reviewing</p>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4 w-full">
          <button
            onClick={() => navigate('/')}
            className="w-full h-16 bg-primary text-slate-900 font-bold rounded-2xl shadow-lg transition-all active:scale-95"
          >
            Back to Discovery
          </button>
          <button
            onClick={() => navigate('/profile/applications')}
            className="w-full h-16 bg-white border border-gray-100 text-slate-600 font-bold rounded-2xl transition-all active:scale-95"
          >
            View Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slideInRight">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white px-5 py-4 border-b border-gray-50 flex items-center">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg text-slate-900 mr-10">
          {appId ? 'Edit Application' : 'Adoption Application'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        {/* Progress Tracker (Only show for new applications) */}
        {!appId && (
          <div className="px-5 mt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-slate-900">Home Environment</span>
              <span className="text-xs text-gray-400">Step 2 of 3</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '66%' }}></div>
            </div>
          </div>
        )}

        <div className="flex-1 px-5 mt-8">
          <h3 className="text-2xl font-bold text-slate-900">Home Environment</h3>

          <div className="mt-6">
            <p className="font-bold text-slate-900 text-sm mb-4">What type of home do you live in?</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'House', icon: 'home' },
                { id: 'Apartment', icon: 'apartment' }
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, homeType: type.id })}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] border-2 transition-all ${formData.homeType === type.id
                    ? 'border-primary bg-primary/10 text-slate-900'
                    : 'border-gray-100 bg-white text-gray-400'
                    }`}
                >
                  <span className={`material-symbols-outlined text-4xl ${formData.homeType === type.id ? 'filled' : ''}`}>
                    {type.icon}
                  </span>
                  <span className="font-bold text-sm">{type.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block font-bold text-slate-900 text-sm mb-2">Landlord's Name (if renting)</label>
              <input
                type="text"
                value={formData.landlordName}
                onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                placeholder="Leave blank if you own"
                className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-4 text-sm focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 pt-4">Experience with Pets</h3>

            <div>
              <label className="block font-bold text-slate-900 text-sm mb-2">Current Pets</label>
              <input
                type="text"
                value={formData.currentPets}
                onChange={(e) => setFormData({ ...formData, currentPets: e.target.value })}
                placeholder="e.g. 1 Golden Retriever, 2 Cats"
                className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-4 text-sm focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 text-sm mb-2">Tell us why you want to adopt</label>
              <textarea
                rows={4}
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Describe your motivation and readiness..."
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:ring-primary focus:border-primary transition-all resize-none outline-none"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="appTerms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 size-5 rounded-md border-gray-300 text-primary focus:ring-primary transition-all"
              />
              <label htmlFor="appTerms" className="text-xs text-gray-500 font-medium leading-relaxed">
                I certify that the information provided is true and I agree to the shelter's <span className="text-primary font-bold">adoption terms and conditions</span>.
              </label>
            </div>
          </div>
        </div>

        <div className="p-5 mt-10 mb-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-16 bg-primary hover:bg-emerald-500 text-slate-900 font-bold text-lg rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="size-6 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
            ) : (
              <>
                {appId ? 'Update Application' : 'Submit Application'}
                <span className="material-symbols-outlined text-xl">{appId ? 'save' : 'send'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
