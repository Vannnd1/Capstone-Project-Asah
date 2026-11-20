import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    PlayCircle, 
    FileText, 
    HelpCircle, 
    CheckCircle, 
    CheckCircle2,
    ArrowLeft, 
    ArrowRight,
    Lock, 
    Award, 
    Clock, 
    BookOpen, 
    Sparkles,
    RotateCcw
} from 'lucide-react';
import { mockJourneys, mockTutorials } from '../mockData';
import { 
    isModuleCompleted, 
    toggleModuleCompleted, 
    getJourneyProgress 
} from '../services/courseProgressService';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const courseId = parseInt(id);

    // Cari data kelas & modul materi
    const course = mockJourneys.find(c => c.id === courseId);
    const modules = mockTutorials.filter(m => m.journey_id === courseId);
    
    const [activeModule, setActiveModule] = useState(modules[0] || null);
    const [completedSet, setCompletedSet] = useState(new Set());
    const [progressStats, setProgressStats] = useState({ completedCount: 0, totalCount: modules.length, percentage: 0, isCompleted: false });
    const [toastMsg, setToastMsg] = useState('');
    const [selectedQuizOption, setSelectedQuizOption] = useState(null);
    const [quizAnswered, setQuizAnswered] = useState(false);

    // Muat progres modul untuk kelas ini
    const refreshProgress = () => {
        const set = new Set();
        modules.forEach(m => {
            if (isModuleCompleted(m.id)) {
                set.add(m.id);
            }
        });
        setCompletedSet(set);
        setProgressStats(getJourneyProgress(courseId));
    };

    useEffect(() => {
        refreshProgress();
        if (modules.length > 0 && !activeModule) {
            setActiveModule(modules[0]);
        }
    }, [courseId]);

    // Reset quiz state ketika berpindah modul
    useEffect(() => {
        setSelectedQuizOption(null);
        setQuizAnswered(false);
    }, [activeModule?.id]);

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
                <BookOpen size={48} className="text-gray-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Kelas Tidak Ditemukan</h2>
                <p className="text-sm text-gray-500 mb-6">Kelas dengan ID #{id} tidak terdaftar di sistem.</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                    Kembali ke Kelas Saya
                </button>
            </div>
        );
    }

    const currentModuleDone = activeModule ? completedSet.has(activeModule.id) : false;
    const currentModuleIndex = modules.findIndex(m => m.id === activeModule?.id);
    const hasNextModule = currentModuleIndex >= 0 && currentModuleIndex < modules.length - 1;
    const nextModule = hasNextModule ? modules[currentModuleIndex + 1] : null;

    // Toggle selesai/belum selesai
    const handleToggleComplete = async () => {
        if (!activeModule) return;
        const willBeDone = await toggleModuleCompleted(activeModule.id, courseId);
        
        refreshProgress();

        if (willBeDone) {
            setToastMsg(`Hebat! Modul "${activeModule.title}" berhasil diselesaikan.`);
            // Jika ada modul berikutnya dan belum selesai, tawarkan atau pindah
            setTimeout(() => {
                setToastMsg('');
            }, 3500);
        } else {
            setToastMsg(`Status modul diubah menjadi belum selesai.`);
            setTimeout(() => {
                setToastMsg('');
            }, 2500);
        }
    };

    const handleNextModule = () => {
        if (nextModule) {
            setActiveModule(nextModule);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* HEADER ATAS */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/courses')} 
                        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        title="Kembali ke Kelas Saya"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                {course.category || 'Alur Belajar'}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Modul {currentModuleIndex + 1} dari {modules.length}
                            </span>
                        </div>
                        <h1 className="font-bold text-gray-900 dark:text-white text-base md:text-lg truncate max-w-md md:max-w-xl">
                            {course.name}
                        </h1>
                    </div>
                </div>

                {/* Progress Indicator Header */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {progressStats.completedCount}/{progressStats.totalCount} Modul Selesai
                        </div>
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${progressStats.percentage}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
                        {progressStats.percentage}%
                    </div>
                </div>
            </header>

            {/* NOTIFIKASI TOAST SUKSES */}
            {toastMsg && (
                <div className="bg-emerald-600 text-white px-6 py-2.5 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-300">
                    <Sparkles size={16} />
                    <span>{toastMsg}</span>
                </div>
            )}

            {/* AREA UTAMA (KONTEN & SIDEBAR) */}
            <div className="flex flex-1 overflow-hidden">
                {/* AREA KONTEN BELAJAR */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center">
                    {activeModule ? (
                        <div className="w-full max-w-4xl space-y-6">
                            
                            {/* SIMULASI MEDIA MODUL */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                {activeModule.type === 'video' ? (
                                    /* Simulasi Video Player */
                                    <div className="relative aspect-video bg-gray-900 flex flex-col items-center justify-center text-white p-6 overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="w-20 h-20 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                                                <PlayCircle size={44} className="ml-1" />
                                            </div>
                                            <p className="mt-4 font-bold text-lg text-white">{activeModule.title}</p>
                                            <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5">
                                                <Clock size={13} /> Durasi Pemutaran: {activeModule.duration}
                                            </p>
                                        </div>

                                        {/* Player Control Bar Mockup */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-10 flex items-center gap-3 text-xs text-gray-300">
                                            <PlayCircle size={18} className="text-white cursor-pointer" />
                                            <div className="flex-1 bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-1.5 w-1/3 rounded-full" />
                                            </div>
                                            <span>04:15 / {activeModule.duration}</span>
                                        </div>
                                    </div>
                                ) : activeModule.type === 'quiz' ? (
                                    /* Simulasi Kuis Interaktif */
                                    <div className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 rounded-xl">
                                                <HelpCircle size={24} />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                                                    Kuis Interaktif Modul
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    Uji Pemahaman Materi: {activeModule.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Soal Kuis Simulasi */}
                                        <div className="bg-white dark:bg-gray-700/60 p-5 rounded-xl border border-gray-200 dark:border-gray-600 mt-4 space-y-3">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Soal: Apa tujuan utama dari prinsip arsitektur yang dibahas pada modul ini?
                                            </p>
                                            <div className="space-y-2 pt-2">
                                                {[
                                                    'A. Meningkatkan efisiensi pemrosesan dan modularitas sistem',
                                                    'B. Mengurangi jumlah file tanpa mempertimbangkan skalabilitas',
                                                    'C. Memaksa seluruh fungsi berjalan sinkron dalam satu thread',
                                                    'D. Menghilangkan kebutuhan autentikasi pada endpoint publik'
                                                ].map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setSelectedQuizOption(idx);
                                                            setQuizAnswered(true);
                                                        }}
                                                        className={`w-full text-left p-3 rounded-lg text-xs md:text-sm transition border ${
                                                            selectedQuizOption === idx
                                                                ? idx === 0
                                                                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold'
                                                                    : 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200 font-semibold'
                                                                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>

                                            {quizAnswered && (
                                                <div className={`mt-3 p-3 rounded-lg text-xs font-medium ${
                                                    selectedQuizOption === 0
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200'
                                                        : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'
                                                }`}>
                                                    {selectedQuizOption === 0
                                                        ? '✓ Benar sekali! Pemahaman konsep modul ini sudah sangat baik.'
                                                        : '✕ Jawaban kurang tepat. Jawaban yang benar adalah A.'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Simulasi Pembacaan Teks Artikel */
                                    <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300 rounded-xl">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                                                    Modul Bacaan & Panduan Praktik
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {activeModule.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Rangkuman & Konten Modul */}
                                <div className="p-6 md:p-8 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            {activeModule.description}
                                        </span>
                                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">
                                            <Clock size={13} /> Estimasi: {activeModule.duration}
                                        </span>
                                    </div>

                                    <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        <p>{activeModule.content}</p>
                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Poin Inti Pembelajaran:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                                <li>Pahami konsep teoretis dan arsitektur di balik studi kasus modul ini.</li>
                                                <li>Lakukan eksperimen kode mandiri untuk menguji perilaku sistem saat beban bertambah.</li>
                                                <li>Tandai selesai untuk memperbarui telemetri belajar dan target harian akunmu.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Action Bar (Tandai Selesai & Lanjut) */}
                                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={handleToggleComplete}
                                            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm ${
                                                currentModuleDone
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                        >
                                            {currentModuleDone ? (
                                                <>
                                                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                                                    <span>Modul Selesai ✓ (Klik untuk Batal)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={18} />
                                                    <span>Tandai Selesai</span>
                                                </>
                                            )}
                                        </button>

                                        {hasNextModule && (
                                            <button
                                                onClick={handleNextModule}
                                                className="w-full sm:w-auto px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                                            >
                                                <span>Modul Berikutnya</span>
                                                <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Banner Jika Kelas Sudah 100% */}
                            {progressStats.isCompleted && (
                                <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 text-center sm:text-left">
                                        <div className="p-3 bg-white/20 rounded-2xl">
                                            <Award size={36} />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg">Selamat! Kamu Telah Menuntaskan Kelas Ini!</h3>
                                            <p className="text-xs text-emerald-100 mt-1">
                                                Seluruh modul materi telah selesai. Keahlianmu terdaftar dan berkontribusi pada skor telemetri AI.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/courses')}
                                        className="px-5 py-2.5 bg-white text-emerald-700 font-bold rounded-xl text-sm hover:bg-emerald-50 transition shrink-0 shadow-sm"
                                    >
                                        Lihat Kelas Lainnya
                                    </button>
                                </div>
                            )}

                        </div>
                    ) : (
                        <p className="text-gray-500">Pilih materi dari daftar modul di samping.</p>
                    )}
                </main>

                {/* SIDEBAR DAFTAR MODUL */}
                <aside className="w-80 md:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-10 flex flex-col">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Daftar Modul Pembelajaran</h3>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{progressStats.completedCount} dari {modules.length} modul selesai</span>
                            <span className="font-bold text-blue-600">{progressStats.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                            <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                                style={{ width: `${progressStats.percentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700 flex-1">
                        {modules.map((modul, index) => {
                            const isDone = completedSet.has(modul.id);
                            const isActive = activeModule?.id === modul.id;

                            return (
                                <button 
                                    key={modul.id} 
                                    onClick={() => setActiveModule(modul)}
                                    className={`w-full p-4 text-left flex gap-3.5 items-start hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                        isActive 
                                            ? 'bg-blue-50/70 dark:bg-blue-900/30 border-l-4 border-blue-600' 
                                            : ''
                                    }`}
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {isDone ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                                <CheckCircle2 size={15} />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-400 flex items-center justify-center text-[10px] font-semibold">
                                                {index + 1}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-xs md:text-sm font-semibold line-clamp-2 leading-snug ${
                                            isActive 
                                                ? 'text-blue-700 dark:text-blue-300 font-bold' 
                                                : isDone 
                                                    ? 'text-gray-900 dark:text-gray-200' 
                                                    : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                            {modul.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 dark:text-gray-500 capitalize">
                                            <span className="flex items-center gap-1">
                                                {modul.type === 'video' && <PlayCircle size={11} />}
                                                {modul.type === 'text' && <FileText size={11} />}
                                                {modul.type === 'quiz' && <HelpCircle size={11} />}
                                                {modul.type}
                                            </span>
                                            <span>•</span>
                                            <span>{modul.duration}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CourseDetail;
