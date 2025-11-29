import { Moon, Sun, Globe, Bell, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';
import HeaderAvatar from '../components/HeaderAvatar';

const Settings = ({ onLogout }) => {
    const { darkMode, toggleTheme, language, changeLanguage, t } = useApp();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            
            <HeaderAvatar onLogout={onLogout}>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Monitor className="text-blue-600" />
                        {t('settings')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Kelola preferensi tampilan dan bahasa aplikasi.</p>
                </div>
            </HeaderAvatar>

            <div className="max-w-3xl">
                {/* --- CARD PENGATURAN --- */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    
                    {/* Header Card */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                        <h3 className="font-bold text-gray-800 dark:text-white">Preferensi Sistem</h3>
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
        </div>
    );
};

export default Settings;