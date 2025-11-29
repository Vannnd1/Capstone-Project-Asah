import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { BrainCircuit, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockSkills, mockUser } from '../mockData';
import { useApp } from '../context/AppContext'; 
import HeaderAvatar from '../components/HeaderAvatar'; 

const Analytics = ({ onLogout }) => { 
    const { darkMode } = useApp();

    const axisColor = darkMode ? '#9CA3AF' : '#4B5563'; 
    const gridColor = darkMode ? '#374151' : '#E5E7EB';

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            
            {/* Header Bagian Atas */}
            <HeaderAvatar onLogout={onLogout}>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BrainCircuit className="text-purple-600" />
                        Analisis AI Mendalam
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Laporan detail mengenai kekuatan, kelemahan, dan potensi belajarmu.</p>
                </div>
            </HeaderAvatar>

            {/* Layout Grid 2 Kolom (50:50) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* --- KOLOM KIRI: GRAFIK RADAR --- */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col justify-center">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-center text-lg">Peta Kompetensi Skill</h3>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                        Visualisasi area penguasaan materi kamu.
                    </p>
                    
                    {/* Container Grafik: Tinggi h-96 agar besar & jelas */}
                    <div className="h-96 w-full flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart 
                                cx="50%" 
                                cy="50%" 
                                outerRadius="65%" /* Ukuran pas agar tidak nabrak pinggir */
                                data={mockSkills}
                                /* Margin Kanan & Kiri ditambah agar teks panjang muat */
                                margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                            >
                                <PolarGrid stroke={gridColor} /> 
                                
                                <PolarAngleAxis 
                                    dataKey="subject" 
                                    /* Font size 12 agar terbaca tapi tidak makan tempat */
                                    tick={{ fontSize: 12, fill: axisColor, fontWeight: 600 }} 
                                />
                                
                                <PolarRadiusAxis 
                                    angle={30} 
                                    domain={[0, 150]} 
                                    tick={false} 
                                    axisLine={false} 
                                />
                                
                                <Radar 
                                    name={mockUser?.display_name || "User"} 
                                    dataKey="A" 
                                    stroke="#8884d8" 
                                    strokeWidth={3}
                                    fill="#8884d8" 
                                    fillOpacity={0.5} 
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- KOLOM KANAN: KARTU ANALISIS --- */}
                <div className="space-y-5">
                    
                    {/* Kartu 1: Kekuatan Utama */}
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-green-100 dark:bg-green-800 p-3 rounded-lg text-green-700 dark:text-green-300 shrink-0">
                            <CheckCircle size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-green-800 dark:text-green-300 text-lg">Kekuatan Utama</h4>
                            <p className="text-green-700 dark:text-green-400 mt-1 text-sm leading-relaxed">
                                Pemahaman <strong>React Core</strong> (Virtual DOM) sangat kuat dengan skor <strong>120/150</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Kartu 2: Area Perbaikan */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-amber-100 dark:bg-amber-800 p-3 rounded-lg text-amber-700 dark:text-amber-300 shrink-0">
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-800 dark:text-amber-300 text-lg">Perlu Ditingkatkan</h4>
                            <p className="text-amber-700 dark:text-amber-400 mt-1 text-sm leading-relaxed">
                                Skor <strong>Testing</strong> (65/150) masih di bawah rata-rata. Coba ambil ulang modul "Unit Testing".
                            </p>
                        </div>
                    </div>

                    {/* Kartu 3: Estimasi Kelulusan */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-lg text-purple-700 dark:text-purple-300 shrink-0">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-purple-800 dark:text-purple-300 text-lg">Estimasi Kelulusan</h4>
                            <p className="text-purple-700 dark:text-purple-400 mt-1 text-sm leading-relaxed">
                                Konsisten terus! AI memprediksi kamu akan lulus pada <strong>12 Desember 2025</strong>.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Analytics;