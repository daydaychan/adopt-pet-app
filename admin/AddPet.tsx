
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPet } from './utils/api';
import { uploadImage } from './utils/r2';
import { NewPetData } from './utils/api';

const AddPet: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<NewPetData, 'image' | 'status' | 'distance'>>({
        name: '',
        category: 'Dogs',
        breed: '',
        age: '',
        gender: 'Male',
        weight: '',
        location: '',
        description: '',
        isUrgent: false,
        isNew: true,
    });

    // We'll set 'distance' to a placeholder since we don't have geo-calc yet
    const DEFAULT_DISTANCE = '5 km';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            alert('Please select an image');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Upload Image
            const imageUrl = await uploadImage(imageFile);

            // 2. Add Pet to DB
            const petData: NewPetData = {
                ...formData,
                image: imageUrl,
                distance: DEFAULT_DISTANCE,
                status: 'Available',
                // Adding string-based IDs is handled in addPet via randomUUID if needed or explicit
            };

            await addPet(petData);

            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Failed to add pet. Please check console and R2 configuration.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Add New Pet</h1>
                <p className="text-slate-500 mt-2">Enter the details below to list a new pet.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Pet Photo</label>
                    <div className="flex items-center gap-6">
                        <div className={`w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative ${!imagePreview && 'text-gray-400'}`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-600 mb-1">Upload a high-quality photo.</p>
                            <p className="text-xs text-gray-400">JPG, PNG up to 5MB. Prefer square or 1:1 aspect ratio.</p>
                            <button type="button" className="mt-3 text-primary text-sm font-medium hover:underline relative">
                                Choose File
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-6">

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. Bella"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Breed</label>
                        <input
                            required
                            type="text"
                            name="breed"
                            value={formData.breed}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. Golden Retriever"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                            <option value="Dogs">Dog</option>
                            <option value="Cats">Cat</option>
                            <option value="Birds">Bird</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Age</label>
                        <input
                            required
                            type="text"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. 2 years"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Weight</label>
                        <input
                            required
                            type="text"
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. 15 kg"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Location</label>
                        <input
                            required
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. San Francisco Shelter"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Description</label>
                        <textarea
                            required
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            placeholder="Tell us about the pet..."
                        />
                    </div>

                    <div className="col-span-2 flex gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isNew"
                                checked={formData.isNew}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300"
                            />
                            <span className="text-sm font-medium text-slate-700">Mark as New Arrival</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isUrgent"
                                checked={formData.isUrgent}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 rounded text-red-500 focus:ring-red-500 border-gray-300"
                            />
                            <span className="text-sm font-medium text-slate-700">Urgent Adoption Needed</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-slate-600 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-primary text-slate-900 font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading && <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>}
                        {isLoading ? 'Saving...' : 'Add Pet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPet;
