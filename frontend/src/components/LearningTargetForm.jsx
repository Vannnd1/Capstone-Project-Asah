import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLearning, TARGET_CONFIGS } from '../context/LearningContext';
import { Target, CheckCircle2, Sparkles, TrendingUp, Calendar, Zap } from 'lucide-react';

const LearningTargetForm = () => {
    const { t } = useApp();
    const { learningTarget, saveLearningTarget, targetProgress } = useLearning();
    const [selectedTarget, setSelectedTarget] = useState(learningTarget || 'fokus');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (learningTarget) {
            setSelectedTarget(learningTarget);
        }
    }, [learningTarget]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            await saveLearningTarget(selectedTarget);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3500);
        } finally {
            setIsSaving(false);
        }
    };

    const targets = [
        {
            key: 'santai',
            title: 'Santai',
            desc: '1 Modul/Hari • Cocok untuk eksplorasi santai tanpa tekanan waktu.',
            modules: 1,
            eta: '~6-8 Minggu',
            color: 'emerald',
            badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
        },
        {
            key: 'fokus',
            title: 'Fokus',
            desc: '3 Modul/Hari • Ritme ideal untuk kemajuan stabil dan pemahaman materi optimal.',
            modules: 3,
            eta: '~3-4 Minggu',
            color: 'blue',
            badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
        },
        {
            key: 'hardcore',
            title: 'Hardcore',
            desc: '5+ Modul/Hari • Akselerasi tinggi untuk kamu yang ingin cepat lulus.',
            modules: 5,
            eta: '~1-2 Minggu',
            color: 'purple',
            badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                            <Target size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('target')}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pilih ritme dan kuota modul belajar harianmu.</p>
                        </div>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        Aktif: <strong className="capitalize">{learningTarget}</strong>
                    </span>
                </div>

                {/* Target Options */}
                <div className="space-y-4 mb-6">
                    {targets.map((target) => {
                        const isSelected = selectedTarget === target.key;
                        const isCurrentActive = learningTarget === target.key;

                        return (
                            <div 
                                key={target.key}
                                onClick={() => setSelectedTarget(target.key)}
                                className={`p-4 rounded-xl cursor-pointer border-2 transition-all relative
                                    ${isSelected
                                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-sm'
                                        : 'bg-white dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900 dark:text-white text-base">
                                                {target.title}
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${target.badge}`}>
                                                {target.modules} Modul / Hari
                                            </span>
                                            {isCurrentActive && (
                                                <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                                                    Target Kamu
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pr-6">
                                            {target.desc}
                                        </p>
                                    </div>

                                    <div className="shrink-0 mt-1">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${isSelected 
                                                ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500' 
                                                : 'border-gray-300 dark:border-gray-600'}`}>
                                            {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={13} className="text-blue-500" />
                                        Estimasi Selesai: <strong className="text-gray-700 dark:text-gray-300">{target.eta}</strong>
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Save Feedback Alert */}
                {saveSuccess && (
                    <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 text-sm animate-in fade-in">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Target berhasil diperbarui! Dashboard dan AI Insight telah disesuaikan.</span>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Zap size={18} />
                            Simpan Perubahan Target
                        </>
                    )}
                </button>
            </div>

            {/* Explanatory Info Card: Pengaruh Target */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-850 p-5 rounded-2xl border border-blue-100 dark:border-gray-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <Sparkles size={16} />
                    Pengaruh Target Belajar Terhadap Fitur Aplikasi
                </h4>
                <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                        <span><strong>Dashboard Progres Harian:</strong> Menampilkan meteran pencapaian harian (contoh: 1/3 modul selesai) secara real-time.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                        <span><strong>Personalisasi AI Insight:</strong> Memberikan evaluasi dan motivasi spesifik yang disesuaikan dengan target yang kamu pilih.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                        <span><strong>Analisis & Prediksi Kelulusan:</strong> Menghitung proyeksi tanggal kelulusan course di halaman Analisis AI.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LearningTargetForm;
