import { Moon, Sun, Globe, Bell, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext'; 

const GeneralSettings = () => {
  // Ambil data & fungsi dari Context
  const { darkMode, toggleTheme, language, changeLanguage, t } = useApp();

  return (
    <div className={`p-6 rounded-xl shadow-sm border h-full transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`flex items-center gap-3 mb-6 border-b pb-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
            <Settings size={24} />
        </div>
        <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('settings')}</h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Preferensi sistem.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-orange-100 text-orange-600'}`}>
                    {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div>
                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('dark_mode')}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('dark_desc')}</p>
                </div>
            </div>
            <button 
                onClick={toggleTheme} // <--- TOMBOL AKTIF
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>

        {/* Bahasa */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"><Globe size={18} /></div>
                <div>
                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('lang_label')}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('lang_desc')}</p>
                </div>
            </div>
            <select 
                value={language}
                onChange={(e) => changeLanguage(e.target.value)} // <--- FUNGSI GANTI BAHASA
                className={`text-sm border rounded-md p-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
                <option value="id">🇮🇩 Indonesia</option>
                <option value="en">🇺🇸 English</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;