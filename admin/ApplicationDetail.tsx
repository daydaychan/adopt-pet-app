
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { updateApplicationStatus } from './utils/api';
import { AdoptionApplication, UserProfile } from '../types';

const ApplicationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [application, setApplication] = useState<AdoptionApplication | null>(null);
    const [applicantProfile, setApplicantProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (appId: string) => {
        setIsLoading(true);
        // 1. Fetch Application
        const { data: appData, error } = await supabase
            .from('applications')
            .select('*')
            .eq('id', appId)
            .single();

        if (error || !appData) {
            console.error('Error fetching application:', error);
            navigate('/admin/applications');
            return;
        }

        const app = {
            ...appData,
            date: new Date(appData.created_at).toLocaleDateString()
        } as AdoptionApplication;

        setApplication(app);

        // 2. Fetch User Profile
        // Note: The application table stores user_id. We fetch profile from profiles table.
        // The type definition for Application has user_id but interface might not show it (it's in DB).
        // Let's assume appData has user_id.
        if (appData.user_id) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', appData.user_id)
                .single();

            if (profile) setApplicantProfile(profile as UserProfile);
        }

        setIsLoading(false);
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!application) return;

        const confirmMsg = `Are you sure you want to change status to ${newStatus}?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            await updateApplicationStatus(application.id, newStatus);
            setApplication(prev => prev ? { ...prev, status: newStatus as any } : null);
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    }

    if (!application) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/admin/applications')}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
                <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
                Back to Applications
            </button>

            {/* Header Section */}
            <header className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-slate-900">Application #{application.id.slice(0, 6)}</h1>
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                            {application.status}
                        </span>
                    </div>
                    <p className="text-slate-500">Applied on {application.date}</p>
                </div>

                <div className="flex gap-2">
                    {application.status !== 'Approved' && (
                        <button
                            onClick={() => handleStatusUpdate('Approved')}
                            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-sm transition-all"
                        >
                            Approve
                        </button>
                    )}
                    {application.status !== 'Declined' && (
                        <button
                            onClick={() => handleStatusUpdate('Declined')}
                            className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold transition-all"
                        >
                            Decline
                        </button>
                    )}
                    {application.status === 'Submitted' && (
                        <button
                            onClick={() => handleStatusUpdate('Reviewing')}
                            className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl font-bold shadow-sm transition-all"
                        >
                            Start Review
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Pet Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Pet Details</h2>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden mb-4">
                            <img src={application.petImage} alt={application.petName} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{application.petName}</h3>
                        <button
                            onClick={() => navigate(`/pet/${application.petId}`)} // This goes to main app pet detail? Wait, main app routes are masked in admin. 
                            // Actually, with HashRouter, /pet/:id is valid. But AdminLayout might not show it nicely inside its outlet?
                            // No, AdminLayout has Outlet. If we navigate to /pet/:id, it matches the * route in App.tsx?
                            // Let's check App.tsx routing.
                            // /pet/:id is under the "Mobile Application" route section. 
                            // So navigating there will exit Admin Layout. That is actually fine/good.
                            className="mt-2 text-primary hover:underline text-sm font-medium"
                        >
                            View Pet Profile
                        </button>
                    </div>
                </div>

                {/* Application Data */}
                <div className="md:col-span-2 space-y-6">

                    {/* Applicant Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Applicant</h2>
                        {applicantProfile ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Name</label>
                                    <p className="font-semibold text-slate-800">{applicantProfile.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Home Type</label>
                                    <p className="font-medium text-slate-800">{applicantProfile.homeType}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Has Garden</label>
                                    <p className="font-medium text-slate-800">{applicantProfile.hasGarden ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Children</label>
                                    <p className="font-medium text-slate-800">{applicantProfile.hasChildren ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-gray-400 mb-1">Bio</label>
                                    <p className="text-sm text-slate-600 leading-relaxed">{applicantProfile.bio}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">User profile not found.</p>
                        )}
                    </div>

                    {/* Questionnaire */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Application Answers</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-1">Current Living Situation</h3>
                                <p className="text-slate-600 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                                    {application.homeType}
                                    {application.landlordName && ` (Landlord: ${application.landlordName})`}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-1">Current Pets</h3>
                                <p className="text-slate-600 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                                    {application.currentPets}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-1">Reason for Adoption</h3>
                                <p className="text-slate-600 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                                    {application.reason}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetail;
