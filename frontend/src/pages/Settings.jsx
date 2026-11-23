import React, { useState } from 'react';
import { Moon, Sun, Globe, Bell, Monitor, User, Palette, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import HeaderAvatar from '../components/HeaderAvatar';
import AvatarPickerModal from '../components/AvatarPickerModal';
import { mockUser } from '../mockData';

const Settings = ({ onLogout }) => {
    const { darkMode, toggleTheme, language, changeLanguage, t } = useApp();
    const { user, updateProfile } = useAuth();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const userName = user?.display_name || user?.username || localStorage.getItem('userName') || mockUser.display_name || 'Siswa';
    const userEmail = user?.email || localStorage.getItem('userEmail') || mockUser.email || 'user@example.com';
    const currentAvatar = user?.image_path || localStorage.getItem('userAvatarPath') || mockUser.image_path || '/avatars/characters/char-felix.svg';

    const handleSelectAvatar = async (path) => {
        try {
            await updateProfile({
                display_name: userName,
                email: userEmail,
                image_path: path,
            });
            localStorage.setItem('userAvatarPath', path);
            setSuccessMsg(t('avatar_saved_msg'));
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
            console.warn('Fallback update avatar di Settings:', err);
            localStorage.setItem('userAvatarPath', path);
            setSuccessMsg(t('avatar_updated_msg'));
            setTimeout(() => setSuccessMsg(''), 4000);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            
            <HeaderAvatar onLogout={onLogout}>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Monitor className="text-blue-600" />
                        {t('settings')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('settings_subtitle')}</p>
                </div>
            </HeaderAvatar>

            {/* Alert Sukses */}
            {successMsg && (
                <div className="max-w-3xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle size={18} className="shrink-0" /> <span>{successMsg}</span>
                </div>
            )}

            <div className="max-w-3xl">
                {/* --- 1. CARD PROFIL & AVATAR BAWAAN --- */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm mb-6">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <User size={18} className="text-blue-600" /> {t('profile_avatar_card')}
                        </h3>
                        <Link 
                            to="/settings/profile" 
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            {t('edit_full_profile')}
                        </Link>
                    </div>

                    <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                <img 
                                    src={currentAvatar} 
                                    alt="Avatar Profil" 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-md transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=fallback';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Palette size={18} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white text-base">{userName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                                <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-gray-400">
                                    <Sparkles size={11} className="text-amber-500" /> {t('avatar_click_hint')}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/20 transition active:scale-95"
                            >
                                <Palette size={14} /> {t('btn_choose_cartoon')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- 2. CARD PENGATURAN SISTEM --- */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    
                    {/* Header Card */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                        <h3 className="font-bold text-gray-800 dark:text-white">{t('system_preferences')}</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        
                        {/* 1. Toggle Dark Mode */}
                        <div className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {darkMode ? <Moon size={22} /> : <Sun size={22} />}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{t('dark_mode')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dark_desc')}</p>
                                </div>
                            </div>
                            {/* Switch Toggle Custom */}
                            <button 
                                onClick={toggleTheme}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {/* 2. Pilihan Bahasa */}
                        <div className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <Globe size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{t('lang_label')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('lang_desc')}</p>
                                </div>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                <button 
                                    onClick={() => changeLanguage('id')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${language === 'id' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                                >
                                    ID
                                </button>
                                <button 
                                    onClick={() => changeLanguage('en')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${language === 'en' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>

                        {/* 3. Notifikasi (Dummy) */}
                        <div className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-red-100 text-red-600">
                                    <Bell size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{t('notif_label')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('notif_desc')}</p>
                                </div>
                            </div>
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" defaultChecked />
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal Pemilihan Avatar Kartun Bawaan */}
            <AvatarPickerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentAvatar={currentAvatar}
                onSelectAvatar={handleSelectAvatar}
            />
        </div>
    );
};

export default Settings;