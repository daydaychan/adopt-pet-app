
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminApplications } from './utils/api';
import { AdoptionApplication } from '../types';

const Applications: React.FC = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<AdoptionApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setIsLoading(true);
        const data = await getAdminApplications();
        setApplications(data);
        setIsLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Declined': return 'bg-red-100 text-red-700';
            case 'Reviewing': return 'bg-yellow-100 text-yellow-700';
            case 'Interview': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 animate-pulse">Loading applications...</div>
            </div>
        );
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
                <p className="text-slate-500 mt-2">Manage adoption requests and reviews.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Pet</th>
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={app.petImage}
                                                    alt={app.petName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="font-bold text-slate-900">{app.petName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Ideally we would have user name here, currently only ID in Application type unless we join profiles */}
                                        {/* For now, we will show ID or if we added name to Application type (denormalized) */}
                                        <span className="font-medium">User {app.id.slice(0, 8)}...</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{app.date.toString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => navigate(`/admin/applications/${app.id}`)}
                                            className="text-primary hover:text-yellow-600 font-medium text-xs transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        No applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Applications;
