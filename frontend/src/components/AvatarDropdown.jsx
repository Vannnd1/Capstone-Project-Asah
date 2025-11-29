import React, { useState } from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// HAPUS: import { useApp } from '../context/AppContext'; // TIDAK DIPERLUKAN DI SINI

const AvatarDropdown = ({ onLogout, userImagePath, userName }) => {
    // Note: Kita HAPUS useApp, jadi Dark Mode di Dropdown mungkin tidak berfungsi, 
    // tapi ini prioritas untuk FIX CRASH.
    
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenuClick = (action) => {
        setIsOpen(false);
        if (action === 'logout') {
            onLogout();
        } else if (action === 'settings') {
            navigate('/settings');
        } else if (action === 'profile') {
            navigate('/settings/profile'); 
        }
    };

    return (
        <div className="relative inline-block text-left z-30">
            {/* Tombol Avatar */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none"
                title={`Profil ${userName}`}
            >
                <img 
                    src={userImagePath} 
                    alt={`Profil ${userName}`}
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-blue-500 shadow-sm object-cover transition" 
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div 
                    // menggunakan class Dark Mode yang AMAN TANPA Context:
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600"
                    role="menu" aria-orientation="vertical" aria-labelledby="menu-button"
                >
                    <div className="py-1">
                        <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-bold border-b border-gray-100 dark:border-gray-600 truncate">
                            {userName}
                        </span>
                    </div>
                    <div className="py-1" role="none">
                        <button 
                            onClick={() => handleMenuClick('profile')}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <User size={16} /> Lihat Profil
                        </button>
                        <button 
                            onClick={() => handleMenuClick('settings')}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <Settings size={16} /> Pengaturan
                        </button>
                    </div>
                    <div className="py-1" role="none">
                        <button 
                            onClick={() => handleMenuClick('logout')}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600"
                        >
                            <LogOut size={16} /> Keluar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;