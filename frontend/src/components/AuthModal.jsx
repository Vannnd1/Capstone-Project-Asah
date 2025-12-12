import React, { useState } from 'react';
import { useApp } from '../context/AppContext'; 
import { login, register } from '../services/ApiService'; 
import { Eye, EyeOff, X } from 'lucide-react'; // Tambah Import Icon

// --- Sub-Komponen: Register Form ---
const RegisterForm = ({ onRegisterSuccess }) => {
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    
    // State untuk mata password
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password);
            alert('Pendaftaran berhasil! Silakan Login untuk melanjutkan.');
            onRegisterSuccess(false); 
        } catch (err) {
            setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                    required
                />
            </div>
            
            {/* Input Password dengan Mata */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"} // Tipe dinamis
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                disabled={loading}
            >
                {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
        </form>
    );
};

// --- Sub-Komponen: Login Form ---
const LoginFormComponent = ({ onLogin }) => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    
    // State untuk mata password
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);

            localStorage.setItem('userId', data.user.user_id); 
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);
            
            const avatar = data.user.image_path || '/assets/avatar-default.png';
            localStorage.setItem('userAvatarPath', avatar);

            onLogin(true); 
        } catch (err) {
            setError(err.message || 'Login gagal. Silakan periksa kembali.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                    required
                />
            </div>
            
            {/* Input Password dengan Mata */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"} // Tipe dinamis
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                disabled={loading}
            >
                {loading ? 'Memproses...' : 'Login'}
            </button>
        </form>
    );
};


// --- Komponen Utama AuthModal ---
const AuthModal = ({ onLogin, onClose, initialMode = 'login' }) => {
    
    const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register'); 
    const { darkMode } = useApp();

    const handleAuthSuccess = (isLoggedIn = false) => {
        if (isLoggedIn) {
            onLogin(); 
        }
        onClose(); 
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            {/* Backdrop Blur effect added via class if desired, or handled by CSS */}
            <div 
                className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Tombol Close X di Pojok Kanan Atas */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    {isRegisterMode ? 'Buat Akun Baru' : 'Masuk ke Adaptive Learning'}
                </h2>
                
                {isRegisterMode 
                    ? <RegisterForm onRegisterSuccess={handleAuthSuccess} />
                    : <LoginFormComponent onLogin={handleAuthSuccess} />
                }

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                    <button 
                        onClick={() => setIsRegisterMode(!isRegisterMode)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {isRegisterMode 
                            ? 'Sudah punya akun? Masuk di sini.' 
                            : 'Belum punya akun? Buat akun sekarang.'
                        }
                    </button>
                    <button 
                        onClick={onClose}
                        className="mt-4 w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;