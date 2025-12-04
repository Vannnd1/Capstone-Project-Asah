import React, { useEffect, useState } from 'react';
import { TrendingUp, Activity, Target as TargetIcon, Calendar, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext'; 
import AvatarDropdown from '../components/AvatarDropdown';
import ProgressChart from '../components/ProgressChart';
import AIInsightCard from '../components/AIInsightCard';
import { getDashboardData } from '../services/ApiService'; 

const Dashboard = ({ onLogout }) => { 
    const { t } = useApp(); 
    
    // --- STATE ---
    const [viewMode, setViewMode] = useState('daily');
    const [selectedMonth, setSelectedMonth] = useState('Jun');
    const [target, setTarget] = useState('');
    
    // State Data Full dari Backend
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data Turunan (Derived State) - Agar aman saat loading
    const chartData = apiData ? (
        viewMode === 'yearly' 
            ? apiData.yearly 
            : apiData.charts[selectedMonth]?.[viewMode] || []
    ) : [];

    const stats = apiData?.statistics || { avgScore: 0, totalHours: 0 };
    const insight = {
        text: apiData?.insightText || 'Memuat insight...',
        color: apiData?.learningStyle === 'consistent_learner' ? 'blue' : 'green'
    };

    const userName = apiData?.user?.name || localStorage.getItem('userName') || 'Siswa';
    const userImagePath = localStorage.getItem('userAvatarPath') || '/assets/avatar-default.png';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil target lokal (karena ini preferensi UI)
                const savedTarget = localStorage.getItem('user_target') || 'belum_diatur';
                setTarget(savedTarget);

                // Panggil Backend
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const data = await getDashboardData(userId);
                    setApiData(data); // Simpan SEMUA data dari backend
                }
            } catch (error) {
                console.error("Gagal ambil data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Cukup dijalankan sekali saat mount

    // Handler Ganti View hanya mengubah state UI, data chart otomatis berubah karena variabel 'chartData' di atas
    const handleViewChange = (mode) => setViewMode(mode);
    const handleMonthChange = (e) => setSelectedMonth(e.target.value);

    if (loading) return (
        <div className="p-10 flex flex-col items-center justify-center space-y-4 h-96">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Menyiapkan data belajar personalmu...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* ... (BAGIAN HEADER & AVATAR SAMA SEPERTI SEBELUMNYA) ... */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('welcome')}, {userName}! 👋 
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t('progressMsg')}</p>
                </div>
                <AvatarDropdown onLogout={onLogout} userImagePath={userImagePath} userName={userName} />
            </header>

            {/* ... (BAGIAN CARDS SAMA, TAPI VARIABLES SUDAH OTOMATIS DARI STATE 'stats') ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card Target */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><TargetIcon size={28}/></div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{t('stat_target')}</p>
                        <p className="text-xl font-bold capitalize text-gray-900 dark:text-white">{target.replace('_', ' ')}</p>
                    </div>
                </div>
                {/* Card Exam Score */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl"><Activity size={28}/></div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{t('stat_exam')}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.avgScore} <span className="text-sm font-normal text-gray-500">/ 100</span></p>
                    </div>
                </div>
                {/* Card Study Hours */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><TrendingUp size={28}/></div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{t('stat_study')}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalHours} <span className="text-sm font-normal text-gray-500">Jam</span></p>
                    </div>
                </div>
            </div>

            {/* ... (BAGIAN CHART & INSIGHT SAMA, DATA SUDAH TERHUBUNG) ... */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    {/* Header Chart */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
                                <Calendar size={20} className="text-blue-600"/> Aktivitas
                            </h3>
                            <div className={`relative transition-opacity duration-300 ${viewMode === 'yearly' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                <select value={selectedMonth} onChange={handleMonthChange} className="appearance-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold py-1.5 px-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                    <option value="Jun">Juni 2025</option>
                                    <option value="Nov">Nov 2025</option>
                                    <option value="Des">Des 2025</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-500 pointer-events-none"/>
                            </div>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                            <button onClick={() => handleViewChange('daily')} className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${viewMode === 'daily' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Harian</button>
                            <button onClick={() => handleViewChange('weekly')} className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${viewMode === 'weekly' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Mingguan</button>
                            <button onClick={() => handleViewChange('yearly')} className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${viewMode === 'yearly' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Tahun Ini</button>
                        </div>
                    </div>
                    {/* Render Chart */}
                    <ProgressChart data={chartData} />
                </div>
                
                {/* Insight Section */}
                <div className="flex flex-col gap-6">
                    <AIInsightCard insight={insight} />
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">🚀 Terus Semangat!</h3>
                        <p className="text-blue-100 text-sm opacity-90">
                            "Konsistensi adalah kunci. Setiap modul yang kamu selesaikan hari ini membawamu lebih dekat ke tujuan."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;