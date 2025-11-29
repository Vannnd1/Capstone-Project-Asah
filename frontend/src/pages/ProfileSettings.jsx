import React, { useState, useEffect } from 'react';
import { User, Camera, Save, ArrowLeft, Mail, AlertCircle, Upload } from 'lucide-react'; // Tambah icon Upload
import { useNavigate } from 'react-router-dom'; 
import { useApp } from '../context/AppContext';
import HeaderAvatar from '../components/HeaderAvatar';
import { updateUserProfile } from '../services/ApiService'; 

const ProfileSettings = ({ onLogout }) => {
    const { t } = useApp();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // State untuk file baru
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const currentName = localStorage.getItem('userName') || 'Siswa';
        const currentEmail = localStorage.getItem('userEmail') || 'user@example.com';
        const currentAvatar = localStorage.getItem('userAvatarPath') || '/assets/avatar-default.png';
        
        setName(currentName);
        setEmail(currentEmail);
        setAvatarUrl(currentAvatar);
    }, []);

    // Handle saat user memilih file gambar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Buat preview gambar lokal agar user bisa lihat sebelum simpan
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error("User ID hilang. Login ulang.");

            // Panggil API dengan File
            const response = await updateUserProfile(userId, name, selectedFile);
            
            // Ambil URL gambar baru dari respons backend (jika ada update foto)
            const newAvatarPath = response.data.image_path || avatarUrl;

            // Update LocalStorage
            localStorage.setItem('userName', name);
            localStorage.setItem('userAvatarPath', newAvatarPath);
            
            alert("Profil berhasil disimpan!");
            window.location.reload(); 

        } catch (error) {
            console.error(error);
            setErrorMsg(error.message || "Gagal update.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header tetap sama ... */}
            <div className="flex flex-col gap-4">
                <button onClick={() => navigate('/settings')} className="self-start flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition">
                    <ArrowLeft size={16} /> Kembali ke Pengaturan
                </button>
                <HeaderAvatar onLogout={onLogout}>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="text-blue-600" /> Edit Profil
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">Update foto dan namamu.</p>
                    </div>
                </HeaderAvatar>
            </div>

            {errorMsg && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded relative flex items-center gap-2">
                    <AlertCircle size={18} /> {errorMsg}
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
                        <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG. Maks 2MB.</p>
                    </div>
                </div>

                {/* KOLOM KANAN: Form (Nama & Email Read-Only) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Input Nama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Input Email (Read Only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                disabled
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900/50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email diambil dari database.</p>
                        </div>

                        {/* Tombol Simpan */}
                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition disabled:opacity-70"
                            >
                                {loading ? 'Mengupload...' : <><Save size={20} /> Simpan Perubahan</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;