import { useApp } from '../context/AppContext'; 
import { BrainCircuit } from 'lucide-react';

const AIInsightCard = ({ insight }) => {
    const { t, darkMode } = useApp(); 

    // Mapping warna untuk border/background yang ringan
    const colorMap = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/40', border: 'border-blue-100 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
        red: { bg: 'bg-red-50 dark:bg-red-900/40', border: 'border-red-100 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
        green: { bg: 'bg-green-50 dark:bg-green-900/40', border: 'border-green-100 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/40', border: 'border-purple-100 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-900/40', border: 'border-amber-100 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300' },
        gray: { bg: 'bg-gray-50 dark:bg-gray-700', border: 'border-gray-100 dark:border-gray-600', text: 'text-gray-700 dark:text-gray-300' },
    };

    const colors = colorMap[insight.color] || colorMap.blue;

    return (
        // Perbaikan: Wrapper utama harus menggunakan dark:bg-gray-800
        <div className={`p-6 rounded-xl border shadow-sm h-full flex flex-col justify-between 
                        bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
            
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                    <BrainCircuit size={20} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">{t('ai_insight')}</h3>
            </div>

            <div className={`flex-1 p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                <p className={`text-sm leading-relaxed ${colors.text}`}>
                    {insight.text}
                </p>
            </div>
        </div>
    );
};

export default AIInsightCard;