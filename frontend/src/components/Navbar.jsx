import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BrainCircuit, Home, BookOpen, BarChart3, Target } from 'lucide-react'; 
import { useApp } from '../context/AppContext'; 

// DAFTAR ITEM NAVIGASI
const navItems = [
    { nameKey: 'dashboard', path: '/', icon: Home, color: 'text-blue-600' },
    { nameKey: 'myClass', path: '/courses', icon: BookOpen, color: 'text-green-600' },
    { nameKey: 'aiAnalysis', path: '/analytics', icon: BarChart3, color: 'text-purple-600' },
    { nameKey: 'target', path: '/target', icon: Target, color: 'text-orange-600' },
];

const Navbar = () => { 
    // Ambil t (translate) dari AppContext
    const { t } = useApp(); 
    
    // --- STATE & DATA UNTUK FOTO PROFIL ---
    const [imgError, setImgError] = useState(false);
    const userAvatar = localStorage.getItem('userAvatarPath');

    // KOMPONEN SVG DEFAULT (Anti-Gagal / Anti-Blank)
    const DefaultAvatarIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-full h-full p-1 bg-gray-200 rounded-full">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
        </svg>
    );

    return (
        // Sidebar Container
        // REVISI PENTING: Hapus 'fixed', ganti 'w-full h-full' agar responsif di dalam Layout wrapper
        <aside className="w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
            
            {/* Header Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                        <BrainCircuit size={24} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{t('app_name')}</span>
                </div>
            </div>
            
            {/* Navigasi Utama */}
            <nav className="flex-1 p-3 space-y-1 mt-4 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 
                            ${isActive
                                // Active State
                                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold'
                                // Inactive State
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`
                        }
                    >
                        {/* Render Icon */}
                        <item.icon size={20} className={item.color} /> 
                        <span className="text-sm">{t(item.nameKey)}</span>
                    </NavLink>
                ))}
            </nav>
            
            {/* Footer Sidebar (Hidden tapi Logic Gambar Ada) */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 hidden">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    {/* LOGIKA PLACEHOLDER: */}
                    {/* Jika user punya avatar DAN tidak error -> Tampilkan Gambar */}
                    {userAvatar && !imgError ? (
                        <img 
                            src={userAvatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)} // Kalau error, switch ke SVG
                        />
                    ) : (
                        // Jika tidak punya avatar ATAU error -> Render SVG langsung
                        <DefaultAvatarIcon />
                    )}
                </div>
            </div>
            
        </aside>
    );
};

export default Navbar;