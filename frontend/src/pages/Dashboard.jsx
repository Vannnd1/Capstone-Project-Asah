import React, { useEffect, useState } from 'react';
import { TrendingUp, Activity, Target as TargetIcon, Calendar, ChevronDown } from 'lucide-react';
// Import data struktur baru
import { 
    mockUser, mockExamResults, mockCompletions, 
    mockChartData, mockYearlyOverview 
} from '../mockData'; 
import { useApp } from '../context/AppContext'; 
import AvatarDropdown from '../components/AvatarDropdown';
import ProgressChart from '../components/ProgressChart';
import AIInsightCard from '../components/AIInsightCard';

const Dashboard = ({ onLogout }) => { 
    const { t } = useApp(); 
    
    // --- STATE ---
    const [chartData, setChartData] = useState([]);
    const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'yearly'
    const [selectedMonth, setSelectedMonth] = useState('Jun'); // Default Juni
    
    const [stats, setStats] = useState({ avgScore: 0, totalHours: 0 });
    const [target, setTarget] = useState('');
    const [insight, setInsight] = useState({ text: '', color: 'blue' });
    const [loading, setLoading] = useState(true);

    const userName = localStorage.getItem('userName') || mockUser.display_name || 'Siswa'; 
    const rawAvatar = localStorage.getItem('userAvatarPath');
    const userImagePath = (rawAvatar && rawAvatar !== 'undefined' && rawAvatar !== 'null') 
        ? rawAvatar 
        : '/assets/avatar-default.png';

    // --- LOGIKA UTAMA: MEMILIH DATA ---
    const updateChartData = (mode, month) => {
        if (mode === 'yearly') {
            setChartData(mockYearlyOverview);
        } else {
            // Ambil data dari object berdasarkan Kunci Bulan (Jun/Nov/Des)
            // Lalu ambil mode (daily/weekly)
            const data = mockChartData[month]?.[mode] || []; 
            setChartData(data);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            const savedTarget = localStorage.getItem('user_target') || 'belum_diatur';
            setTarget(savedTarget);

            // Load awal
            updateChartData('daily', 'Jun');

            const totalScore = mockExamResults.reduce((acc, curr) => acc + curr.score, 0);
            const average = Math.round(totalScore / mockExamResults.length);
            const hours = Math.round(mockCompletions.study_duration / 60);
            setStats({ avgScore: average, totalHours: hours });

            // Insight Logic
            let analysis = "";
            let themeColor = "blue";
            
            // Logika Insight menyesuaikan bulan yang dipilih
            // Misal: Cek total aktivitas di bulan tersebut
            const currentMonthData = mockChartData[selectedMonth]?.weekly || [];
            const totalActivity = currentMonthData.reduce((acc, curr) => acc + curr.value, 0);

            if (totalActivity < 10) {
                analysis = `⚠️ PERHATIAN: Aktivitas di bulan ${selectedMonth} sangat rendah. Ayo kejar ketertinggalan!`;
                themeColor = "red";
            } else if (savedTarget === 'hardcore') {
                analysis = "🔥 MANTAP: Kamu konsisten di jalur Hardcore bulan ini.";
                themeColor = "green";
            } else {
                analysis = `✅ BAGUS: Kamu cukup aktif di bulan ${selectedMonth}. Pertahankan!`;
                themeColor = "blue";
            }

            setInsight({ text: analysis, color: themeColor });
            setLoading(false);
        }, 800);
    }, [selectedMonth]); // Re-run effect jika bulan berubah untuk update Insight

    // Handler Ganti View (Harian/Mingguan/Tahunan)
    const handleViewChange = (mode) => {
        setViewMode(mode);
        updateChartData(mode, selectedMonth);
    };

    // Handler Ganti Bulan
    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        setSelectedMonth(newMonth);
        // Jika sedang mode yearly, tidak perlu update chart (karena yearly itu setahun full)
        // Tapi jika mode daily/weekly, update datanya sesuai bulan baru
        if (viewMode !== 'yearly') {
            updateChartData(viewMode, newMonth);
        }
    };

    if (loading) return (
        <div className="p-10 flex flex-col items-center justify-center space-y-4 h-96">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Memuat data dashboard...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            
            {/* HEADER (Tetap Sama) */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('welcome')}, {userName}! 👋 
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {t('progressMsg')}
                    </p>
                </div>
                <AvatarDropdown onLogout={onLogout} userImagePath={userImagePath} userName={userName} />
            </header>

            {/* CARDS (Tetap Sama) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><TargetIcon size={28}/></div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{t('stat_target')}</p>
                        <p className="text-xl font-bold capitalize text-gray-900 dark:text-white">{target.replace('_', ' ')}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl"><Activity size={28}/></div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{t('stat_exam')}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.avgScore} <span className="text-sm font-normal text-gray-500">/ 100</span></p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><TrendingUp size={28}/></div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{t('stat_study')}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalHours} <span className="text-sm font-normal text-gray-500">Jam</span></p>
                    </div>
                </div>
            </div>

            {/* --- CHART SECTION (FITUR BARU) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        
                        {/* KIRI: Judul + Dropdown Bulan */}
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
                                <Calendar size={20} className="text-blue-600"/>
                                Aktivitas
                            </h3>

                            {/* Dropdown Bulan: Aktif jika BUKAN mode 'Yearly' */}
                            <div className={`relative transition-opacity duration-300 ${viewMode === 'yearly' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                <select 
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    className="appearance-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold py-1.5 px-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    <option value="Jun">Juni 2025</option>
                                    <option value="Nov">Nov 2025</option>
                                    <option value="Des">Des 2025</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-500 pointer-events-none"/>
                            </div>
                        </div>
                        
                        {/* KANAN: Toggle Harian/Mingguan/Tahun */}
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                            <button 
                                onClick={() => handleViewChange('daily')} 
                                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${viewMode === 'daily' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                            >
                                Harian
                            </button>
                            <button 
                                onClick={() => handleViewChange('weekly')} 
                                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${viewMode === 'weekly' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                            >
                                Mingguan
                            </button>
                            <button 
                                onClick={() => handleViewChange('yearly')} 
                                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${viewMode === 'yearly' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                            >
                                Tahun Ini
                            </button>
                        </div>
                    </div>

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