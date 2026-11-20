import React, { useState, useEffect } from 'react';
import { User, Camera, Save, ArrowLeft, Mail, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import HeaderAvatar from '../components/HeaderAvatar';
import { getStoredUser } from '../services/ApiService'; 

const ProfileSettings = ({ onLogout }) => {
    const { t } = useApp();
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const storedUser = getStoredUser() || {};
        const activeUser = user || storedUser;
        const currentName = activeUser.display_name || activeUser.username || localStorage.getItem('userName') || 'Siswa';
        const currentEmail = activeUser.email || localStorage.getItem('userEmail') || 'user@example.com';
        const currentAvatar = activeUser.image_path || localStorage.getItem('userAvatarPath') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
        
        setName(currentName);
        setEmail(currentEmail);
        setAvatarUrl(currentAvatar);
    }, [user]);

    // Kompres gambar menjadi thumbnail ringan (<30KB) sebelum dikirim
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 256;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height = Math.round(height * (MAX_SIZE / width));
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width = Math.round(width * (MAX_SIZE / height));
                            height = MAX_SIZE;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    // Handle saat user memilih file gambar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatarUrl(URL.createObjectURL(file));
            setErrorMsg('');
            setSuccessMsg('');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName) {
            setErrorMsg("Nama lengkap tidak boleh kosong.");
            setLoading(false);
            return;
        }

        if (!cleanEmail) {
            setErrorMsg("Email tidak boleh kosong.");
            setLoading(false);
            return;
        }

        try {
            let finalAvatar = avatarUrl;
            if (selectedFile) {
                try {
                    finalAvatar = await compressImage(selectedFile);
                } catch (compressErr) {
                    console.warn("Gagal kompresi gambar, fallback ke avatarUrl:", compressErr);
                }
            }

            const payload = {
                display_name: cleanName,
                email: cleanEmail,
                image_path: finalAvatar,
            };

            const updated = await updateProfile(payload);
            
            // Perbarui state lokal
            setName(updated.display_name || cleanName);
            setEmail(updated.email || cleanEmail);
            setAvatarUrl(updated.image_path || finalAvatar);
            setSelectedFile(null);
            setSuccessMsg("Profil dan email berhasil diperbarui!");
        } catch (error) {
            console.error("Gagal update profil:", error);
            setErrorMsg(error.message || "Gagal menyimpan perubahan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button onClick={() => navigate('/settings')} className="self-start flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition">
                    <ArrowLeft size={16} /> Kembali ke Pengaturan
                </button>
                <HeaderAvatar onLogout={onLogout}>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="text-blue-600" /> Edit Profil
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">Update nama, email, dan foto profil akunmu.</p>
                    </div>
                </HeaderAvatar>
            </div>

            {/* Alert Error */}
            {errorMsg && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} className="shrink-0" /> <span>{errorMsg}</span>
                </div>
            )}

            {/* Alert Sukses */}
            {successMsg && (
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle size={18} className="shrink-0" /> <span>{successMsg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: Upload Foto */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center text-center h-fit">
                    <div className="relative group mb-6">
                        <img 
                            src={avatarUrl} 
                            alt="Preview" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-md"
                        />
                        {/* INPUT FILE TERSEMBUNYI DI BALIK IKON KAMERA */}
                        <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="text-white" size={32} />
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <div className="w-full">
                        <label className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium">
                            <Upload size={16} />
                            {selectedFile ? 'Ganti Foto' : 'Pilih Foto'}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                        <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG. Otomatis dioptimalkan.</p>
                    </div>
                </div>

                {/* KOLOM KANAN: Form (Nama & Email Editable) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Input Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrorMsg('');
                                    }}
                                    required
                                    placeholder="Nama Lengkap"
                                    className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                />
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Nama ini akan ditampilkan pada dashboard dan header.</p>
                        </div>

                        {/* Input Email (Bisa Diedit) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrorMsg('');
                                    }}
                                    required
                                    placeholder="nama@email.com"
                                    className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                />
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email aktif yang terhubung dengan akun dan dapat digunakan untuk login.</p>
                        </div>

                        {/* Tombol Simpan */}
                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition disabled:opacity-70 shadow-sm"
                            >
                                {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan Perubahan</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
