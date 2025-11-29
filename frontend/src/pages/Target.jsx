import LearningTargetForm from '../components/LearningTargetForm';
import { useApp } from '../context/AppContext'; 
import HeaderAvatar from '../components/HeaderAvatar'; 

// Pastikan komponen menerima onLogout dari MainLayout
const Target = ({ onLogout }) => { 
    const { t } = useApp();
    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-500 pb-10">
            
            {/* 1. GUNAKAN HEADER AVATAR YANG MENAMPILKAN DROPDOWN */}
            <HeaderAvatar onLogout={onLogout}>
                {/* Judul Halaman di slot children HeaderAvatar */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('target')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">Tentukan intensitas belajar agar AI bisa menyesuaikan saran.</p>
                </div>
            </HeaderAvatar>
            
            <LearningTargetForm />
        </div>
    );
};

export default Target;