import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockJourneys } from '../mockData';
import { useApp } from '../context/AppContext';
import HeaderAvatar from '../components/HeaderAvatar'; 

// Komponen HARUS menerima onLogout dari MainLayout
const MyCourses = ({ onLogout }) => { 
    const navigate = useNavigate();
    const { t } = useApp();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* 1. GUNAKAN HEADER AVATAR DAN MASUKKAN JUDUL SEBAGAI CHILDREN */}
            <HeaderAvatar onLogout={onLogout}>
                {/* Judul Halaman di slot children HeaderAvatar */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('myClass')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">Daftar alur belajar (journey) yang sedang kamu ikuti.</p>
                </div>
            </HeaderAvatar>
            
            {/* KONTEN UTAMA */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockJourneys.map((journey) => (
                    // Card Course (Sudah mendukung Dark Mode)
                    <div key={journey.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        
                        <div className="h-40 bg-gray-100 relative">
                            <img src={journey.image_path} alt={journey.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700">
                                {journey.difficulty}
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">{journey.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{journey.summary}</p>
                            
                            <div className="mb-4">
                                <div className="flex justify-between text-xs font-medium mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Progres Belajar</span>
                                    <span className="text-blue-600">{journey.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${journey.progress}%` }}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <BookOpen size={14} />
                                    {journey.total_modules} Modul
                                </div>
                                
                                <button 
                                    onClick={() => navigate(`/course/${journey.id}`)} 
                                    className="px-4 py-2 bg-gray-900 dark:bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition"
                                >
                                    {journey.progress > 0 ? 'Lanjut Belajar' : 'Mulai Belajar'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCourses;