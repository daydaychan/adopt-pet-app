
import React, { useEffect, useState } from 'react';
import { getAdminPets, updatePetStatus } from './utils/api';
import { Pet } from '../types';

const Dashboard: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        setIsLoading(true);
        const data = await getAdminPets();
        setPets(data);
        setIsLoading(false);
    };

    const handleStatusChange = async (pet: Pet) => {
        const newStatus = pet.status === 'Available' ? 'Adopted' : 'Available';
        const confirmMessage = newStatus === 'Adopted'
            ? `Are you sure you want to mark ${pet.name} as Adopted? It will be hidden from the main app.`
            : `Mark ${pet.name} as Available again?`;

        if (!window.confirm(confirmMessage)) return;

        try {
            await updatePetStatus(pet.id, newStatus);
            setPets(prev => prev.map(p => p.id === pet.id ? { ...p, status: newStatus } : p));
        } catch (error) {
            alert('Failed to update status');
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 animate-pulse">Loading pets...</div>
            </div>
        );
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Pet Dashboard</h1>
                <p className="text-slate-500 mt-2">Manage your shelter's pets and adoption status.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Pet</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Breed</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pets.map((pet) => (
                                <tr key={pet.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={pet.image}
                                                    alt={pet.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{pet.name}</div>
                                                <div className="text-xs text-gray-400">{pet.age} • {pet.gender}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {pet.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{pet.breed}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${pet.status === 'Available' || !pet.status // Handle legacy data
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${pet.status === 'Available' || !pet.status
                                                    ? 'bg-green-500'
                                                    : 'bg-slate-400'
                                                }`}></span>
                                            {pet.status || 'Available'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {pet.status === 'Adopted' ? (
                                            <button
                                                onClick={() => handleStatusChange(pet)}
                                                className="text-primary hover:text-yellow-600 font-medium text-xs transition-colors"
                                            >
                                                Relist
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(pet)}
                                                className="text-red-500 hover:text-red-600 font-medium text-xs transition-colors"
                                            >
                                                Mark Adopted
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
