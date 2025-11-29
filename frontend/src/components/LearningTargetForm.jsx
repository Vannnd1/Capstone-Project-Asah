import React, { useState } from 'react';
import { useApp } from '../context/AppContext'; 
import { Target } from 'lucide-react';

const LearningTargetForm = () => {
    const { t } = useApp(); 
    const [selectedTarget, setSelectedTarget] = useState(localStorage.getItem('user_target') || 'fokus');

    const handleSave = () => {
        localStorage.setItem('user_target', selectedTarget);
        alert(`Target "${selectedTarget}" disimpan!`);
    };

    const targets = [
        { key: 'santai', title: 'Santai', desc: '1 Modul/Hari • Santai' },
        { key: 'fokus', title: 'Fokus', desc: '3 Modul/Hari • Sedang' },
        { key: 'hardcore', title: 'Hardcore', desc: '5+ Modul/Hari • Intensif' },
    ];

    return (
        // Perbaikan: Wrapper utama harus gelap
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            
            <div className="flex items-center gap-3 mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    <Target size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('target')}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tentukan intensitas belajar harianmu.</p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                {targets.map((target) => (
                    <div 
                        key={target.key}
                        onClick={() => setSelectedTarget(target.key)}
                        // Perbaikan: Tambahkan dark:hover:bg dan sesuaikan border
                        className={`p-4 rounded-lg cursor-pointer border transition-all 
                                    ${selectedTarget === target.key
                                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-700'
                                        : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }
                                    flex justify-between items-center`}
                    >
                        <div>
                            <p className={`font-medium text-gray-900 dark:text-white`}>{target.title}</p>
                            <p className={`text-sm text-gray-500 dark:text-gray-400`}>{target.desc}</p>
                        </div>
                        {selectedTarget === target.key && (
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        )}
                    </div>
                ))}
            </div>

            <button 
                onClick={handleSave} 
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
                Simpan Target
            </button>
        </div>
    );
};

export default LearningTargetForm;