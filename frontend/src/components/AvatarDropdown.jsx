import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const AvatarDropdown = ({ userImagePath, userName, onLogout }) => {
    const { t } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // --- STATE UNTUK ERROR GAMBAR ---
    const [imgError, setImgError] = useState(false);

    // Reset error jika gambar profil berubah
    useEffect(() => {
        setImgError(false);
    }, [userImagePath]);

    // Toggle dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- KOMPONEN SVG PLACEHOLDER (ANTI BLANK) ---
    const DefaultAvatarIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-full h-full p-1 bg-gray-200 rounded-full">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            {/* BUTTON TRIGGER */}
            <button 
                onClick={toggleDropdown}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                {/* --- BAGIAN FOTO (LOGIKA PLACEHOLDER) --- */}
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                    {/* Logika: Ada Path Foto DAN Tidak Error -> Tampilkan Foto */}
                    {userImagePath && !imgError ? (
                        <img 
                            src={userImagePath} 
                            alt={userName} 
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)} // Jika error, switch ke SVG
                        />
                    ) : (
                        // Jika tidak ada foto atau error -> Tampilkan SVG Placeholder
                        <DefaultAvatarIcon />
                    )}
                </div>

                {/* --- TEKS NAMA --- */}


                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* --- DROPDOWN MENU --- */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userName}</p>
                        <p className="text-xs text-gray-500">{t('student_mode')}</p>
                    </div>

                    <Link to="/settings/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <User size={16} /> {t('profile')}
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Settings size={16} /> {t('settings')}
                    </Link>
                    
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>

                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                        <LogOut size={16} /> {t('logout')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;