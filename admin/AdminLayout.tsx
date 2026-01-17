
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="material-symbols-outlined text-primary text-3xl">pets</span>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">PetAdmin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-slate-800'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined mb-0.5">dashboard</span>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/add"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-slate-800'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined mb-0.5">add_circle</span>
                        Add New Pet
                    </NavLink>

                    <NavLink
                        to="/admin/applications"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-slate-800'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined mb-0.5">assignment</span>
                        Applications
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all font-medium"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Exit Admin
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
