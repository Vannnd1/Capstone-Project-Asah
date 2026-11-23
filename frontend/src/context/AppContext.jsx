import React, { createContext, useState, useEffect, useContext } from 'react'; 
import { translations } from '../data/translations';

// Re-export translations
export { translations };

// Buat Context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // --- LOGIKA DARK MODE ---
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    // --- LOGIKA BAHASA ---
    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'id');

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    // Fungsi penerjemah otomatis dengan dukungan interpolasi {param}
    const t = (key, params) => {
        let text = translations[language]?.[key] ?? translations['id']?.[key] ?? key;
        if (params && typeof text === 'string') {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
            });
        }
        return text;
    };

    return (
        <AppContext.Provider value={{ darkMode, toggleTheme, language, changeLanguage, t, translations }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook biar gampang dipanggil
export const useApp = () => useContext(AppContext);
