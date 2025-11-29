import React, { createContext, useState, useEffect, useContext } from 'react'; 
// 1. KAMUS BAHASA (Dictionary)
const translations = {
    id: {
        dashboard: "Dashboard",
        myClass: "Kelas Saya",
        aiAnalysis: "Analisis AI",
        target: "Target Belajar",
        settings: "Pengaturan",
        logout: "Keluar",
        welcome: "Halo",
        progressMsg: "Berikut progres belajar berdasarkan aktivitasmu.",
        stat_target: "Target Mode",
        stat_exam: "Rata-rata Ujian",
        stat_study: "Total Belajar",
        graph_title: "Aktivitas Modul Harian",
        ai_insight: "AI Insight",
        dark_mode: "Mode Fokus Malam",
        dark_desc: "Kurangi kelelahan mata.",
        lang_label: "Bahasa",
        lang_desc: "Pilih bahasa antarmuka.",
        notif_label: "Pengingat Target",
        notif_desc: "Notifikasi harian."
    },
    en: {
        dashboard: "Dashboard",
        myClass: "My Courses",
        aiAnalysis: "AI Analytics",
        target: "Learning Target",
        settings: "Settings",
        logout: "Logout",
        welcome: "Hello",
        progressMsg: "Here is your learning progress based on activity.",
        stat_target: "Target Mode",
        stat_exam: "Exam Average",
        stat_study: "Study Hours",
        graph_title: "Daily Module Activity",
        ai_insight: "AI Insight",
        dark_mode: "Night Focus Mode",
        dark_desc: "Reduce eye strain.",
        lang_label: "Language",
        lang_desc: "Choose interface language.",
        notif_label: "Target Reminder",
        notif_desc: "Daily notifications."
    }
};

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

    // Fungsi penerjemah otomatis
    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        // Hanya mengekspos fungsi-fungsi Context
        <AppContext.Provider value={{ darkMode, toggleTheme, language, changeLanguage, t }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook biar gampang dipanggil
export const useApp = () => useContext(AppContext);