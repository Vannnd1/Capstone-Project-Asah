import React, { useState, useEffect } from 'react';
import { 
    BookOpen, 
    Search, 
    CheckCircle2, 
    Clock, 
    Award, 
    Sparkles, 
    Flame, 
    ArrowRight, 
    TrendingUp, 
    Layers,
    Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import HeaderAvatar from '../components/HeaderAvatar';
import { 
    getAllJourneysWithProgress, 
    getStudentProgressSummary 
} from '../services/courseProgressService';

const MyCourses = ({ onLogout }) => { 
    const navigate = useNavigate();
    const { t } = useApp();

    const [journeys, setJourneys] = useState([]);
    const [stats, setStats] = useState({
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        notStartedCourses: 0,
        averageProgress: 0,
        totalModulesDone: 0
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'active', 'completed', 'not_started'
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Muat data kelas dengan progres dinamis
    const loadCoursesData = () => {
        const loadedJourneys = getAllJourneysWithProgress();
        const loadedStats = getStudentProgressSummary();
        setJourneys(loadedJourneys);
        setStats(loadedStats);
    };

    useEffect(() => {
        loadCoursesData();

        // Listener jika ada modul yang selesai di CourseDetail
        const handleProgressUpdated = () => {
            loadCoursesData();
        };

        window.addEventListener('course-progress-updated', handleProgressUpdated);
        return () => window.removeEventListener('course-progress-updated', handleProgressUpdated);
    }, []);

    // Filter daftar kelas
    const filteredJourneys = journeys.filter(journey => {
        const matchesSearch = 
            journey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            journey.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (journey.category && journey.category.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = 
            selectedStatus === 'all' || 
            (selectedStatus === 'active' && journey.status === 'active') ||
            (selectedStatus === 'completed' && journey.status === 'completed') ||
            (selectedStatus === 'not_started' && journey.status === 'not_started');

        const matchesCategory = 
            selectedCategory === 'all' || 
            journey.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Kategori unik untuk filter chips
    const categories = ['all', 'Frontend', 'Backend', 'AI & Data', 'Cloud & DevOps', 'Design'];

    const getDifficultyBadge = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
            case 'intermediate':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700';
            case 'advanced':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header & Avatar */}
            <HeaderAvatar onLogout={onLogout}>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="text-blue-600" /> {t('myClass')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Pantau kemajuan belajar nyata, selesaikan modul, dan raih sertifikat kompetensi.
                    </p>
                </div>
            </HeaderAvatar>

            {/* STATISTIK RINGKASAN PROGRES SISWA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-xl">
                        <Layers size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Kelas</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalCourses} Kelas</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 rounded-xl">
                        <Flame size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sedang Berjalan</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.inProgressCourses} Kelas</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 rounded-xl">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Kelas Tuntas</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.completedCourses} Kelas</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 rounded-xl">
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rata-rata Progres</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.averageProgress}%</p>
                    </div>
                </div>
            </div>

            {/* FILTER & PENCARIAN */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari kelas atau topik..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>

                    {/* Filter Status Tabs */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full md:w-auto overflow-x-auto text-xs font-semibold">
                        <button
                            onClick={() => setSelectedStatus('all')}
                            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                                selectedStatus === 'all'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                            }`}
                        >
                            Semua ({stats.totalCourses})
                        </button>
                        <button
                            onClick={() => setSelectedStatus('active')}
                            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                                selectedStatus === 'active'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                            }`}
                        >
                            Sedang Belajar ({stats.inProgressCourses})
                        </button>
                        <button
                            onClick={() => setSelectedStatus('completed')}
                            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                                selectedStatus === 'completed'
                                    ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-300 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                            }`}
                        >
                            Selesai ({stats.completedCourses})
                        </button>
                        <button
                            onClick={() => setSelectedStatus('not_started')}
                            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                                selectedStatus === 'not_started'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                            }`}
                        >
                            Belum Mulai ({stats.notStartedCourses})
                        </button>
                    </div>
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
                    <span className="text-gray-400 font-medium flex items-center gap-1 shrink-0">
                        <Filter size={14} /> Kategori:
                    </span>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full border transition whitespace-nowrap ${
                                selectedCategory === cat
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {cat === 'all' ? 'Semua Topik' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* DAFTAR CARD KELAS */}
            {filteredJourneys.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Tidak ada kelas yang cocok</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Coba sesuaikan filter status atau kata kunci pencarianmu.</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedStatus('all');
                            setSelectedCategory('all');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        Reset Filter
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJourneys.map((journey) => {
                        const isDone = journey.progress === 100;
                        const hasStarted = journey.progress > 0;

                        return (
                            <div 
                                key={journey.id} 
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col group"
                            >
                                {/* Thumbnail Image & Badges */}
                                <div className="h-44 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                                    <img 
                                        src={journey.image_path} 
                                        alt={journey.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                                    
                                    {/* Top Badges */}
                                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-semibold text-white">
                                            {journey.category || 'Teknologi'}
                                        </span>
                                        <span className={`px-2.5 py-1 backdrop-blur-md rounded-md text-xs font-bold border ${getDifficultyBadge(journey.difficulty)}`}>
                                            {journey.difficulty}
                                        </span>
                                    </div>

                                    {/* Bottom Status Pill on Image */}
                                    <div className="absolute bottom-3 left-3">
                                        {isDone ? (
                                            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                                                <Award size={14} /> Tuntas 100%
                                            </span>
                                        ) : hasStarted ? (
                                            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                                                <Flame size={14} /> Berlangsung
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-800/80 text-gray-200 rounded-full text-xs font-medium backdrop-blur-sm">
                                                Belum Dimulai
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        {journey.name}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                                        {journey.summary}
                                    </p>
                                    
                                    {/* Progress Bar & Indicators */}
                                    <div className="mb-4 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                                            <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                                {isDone ? (
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Semua Modul Tuntas</span>
                                                ) : (
                                                    <span>Progres Belajar</span>
                                                )}
                                            </span>
                                            <span className={`font-bold ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                                {journey.progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className={`h-2.5 rounded-full transition-all duration-700 ${
                                                    isDone 
                                                        ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                                }`} 
                                                style={{ width: `${journey.progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
                                            <span>{journey.completed_modules || 0} dari {journey.total_modules} modul selesai</span>
                                            {isDone && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Sertifikat Tersedia</span>}
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <BookOpen size={14} />
                                            <span>{journey.total_modules} Modul Materi</span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => navigate(`/course/${journey.id}`)} 
                                            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${
                                                isDone 
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50' 
                                                    : hasStarted
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                                        : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
                                            }`}
                                        >
                                            <span>{isDone ? 'Ulas Materi' : hasStarted ? 'Lanjut Belajar' : 'Mulai Belajar'}</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyCourses;
