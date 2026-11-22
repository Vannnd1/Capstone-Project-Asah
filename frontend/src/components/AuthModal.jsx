import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, X, Check } from "lucide-react";

const REGISTER_AVATARS = [
  { name: 'Felix Pelajar', path: '/avatars/characters/char-felix.svg' },
  { name: 'Aneka Desain', path: '/avatars/characters/char-aneka.svg' },
  { name: 'Bolt Bot', path: '/avatars/robots/robot-bolt.svg' },
  { name: 'Senyum Ceria', path: '/avatars/emojis/emoji-happy.svg' },
  { name: 'Alex Pengelana', path: '/avatars/adventurers/adv-alex.svg' },
  { name: 'Gummy Biru', path: '/avatars/creatures/blob-gummy.svg' },
];

// --- Sub-Komponen: Register Form ---
const RegisterForm = ({ onRegisterSuccess }) => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    display_name: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState('/avatars/characters/char-felix.svg');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        ...formData,
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        display_name: formData.display_name.trim(),
        image_path: selectedAvatar,
      });
      onRegisterSuccess(true); // Login langsung setelah register
    } catch (err) {
      setError(err.message || "Pendaftaran gagal. Silakan coba lagi.");
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          placeholder="john_doe"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nama Lengkap
        </label>
        <input
          type="text"
          name="display_name"
          value={formData.display_name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          placeholder="john@example.com"
          required
        />
      </div>

      {/* Input Password dengan Mata */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
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

      {/* Pilihan Avatar Kartun Bawaan */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
          <span>Pilih Avatar Kartun:</span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400">Bisa diubah nanti</span>
        </label>
        <div className="grid grid-cols-6 gap-2">
          {REGISTER_AVATARS.map((av) => {
            const isSel = selectedAvatar === av.path;
            return (
              <button
                key={av.path}
                type="button"
                onClick={() => setSelectedAvatar(av.path)}
                title={av.name}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                  isSel
                    ? "border-red-500 ring-2 ring-red-500/40 scale-105 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-400"
                }`}
              >
                <img src={av.path} alt={av.name} className="w-full h-full object-cover" />
                {isSel && (
                  <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                    <Check size={14} className="text-white drop-shadow" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Memproses..." : "Buat Akun"}
      </button>
    </form>
  );
};

// --- Sub-Komponen: Login Form ---
const LoginFormComponent = ({ onLogin }) => {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username.trim(), password.trim());
      onLogin(true);
    } catch (err) {
      setError(err.message || "Login gagal. Silakan periksa kembali.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("siswa_demo");
    setPassword("password123");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Info & Tombol Demo Account */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
        <div>
          <span className="font-semibold block">Akun Demo:</span>
          <span>User: <code className="bg-blue-100 dark:bg-blue-800/60 px-1 py-0.5 rounded font-mono">siswa_demo</code> | Pass: <code className="bg-blue-100 dark:bg-blue-800/60 px-1 py-0.5 rounded font-mono">password123</code></span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="ml-2 px-2.5 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition shrink-0"
        >
          Isi Cepat
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          placeholder="john_doe"
          required
        />
      </div>

      {/* Input Password dengan Mata */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
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
        {loading ? "Memproses..." : "Login"}
      </button>
    </form>
  );
};

// --- Komponen Utama AuthModal ---
const AuthModal = ({ onLogin, onClose, initialMode = "login" }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(
    initialMode === "register"
  );
  const { darkMode } = useApp();

  const handleAuthSuccess = (isLoggedIn = false) => {
    if (isLoggedIn) {
      onLogin();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
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
          {isRegisterMode ? "Buat Akun Baru" : "Masuk ke AI Learning Insight"}
        </h2>

        {isRegisterMode ? (
          <RegisterForm onRegisterSuccess={handleAuthSuccess} />
        ) : (
          <LoginFormComponent onLogin={handleAuthSuccess} />
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isRegisterMode
              ? "Sudah punya akun? Masuk di sini."
              : "Belum punya akun? Buat akun sekarang."}
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
