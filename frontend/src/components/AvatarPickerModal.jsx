import React, { useState, useMemo } from 'react';
import { X, Check, Search, Sparkles, Bot, Shield, Smile, SmilePlus, Heart, Palette } from 'lucide-react';
import { AVATAR_CATEGORIES, DEFAULT_AVATARS } from '../data/defaultAvatars';

const categoryIcons = {
  all: Sparkles,
  characters: Smile,
  robots: Bot,
  emojis: SmilePlus,
  adventurers: Shield,
  creatures: Heart,
};

const AvatarPickerModal = ({ isOpen, onClose, currentAvatar, onSelectAvatar }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState(currentAvatar || '');

  // Reset tempSelected saat modal dibuka
  React.useEffect(() => {
    if (isOpen) {
      setTempSelected(currentAvatar || '');
    }
  }, [isOpen, currentAvatar]);

  // Filter avatar berdasarkan kategori dan pencarian
  const filteredAvatars = useMemo(() => {
    return DEFAULT_AVATARS.filter((avatar) => {
      const matchCategory = selectedCategory === 'all' || avatar.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        avatar.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // 1x Klik langsung memilih & menutup modal
  const handleSelectOne = (path) => {
    setTempSelected(path);
    onSelectAvatar(path);
    onClose();
  };

  const handleConfirm = () => {
    if (tempSelected) {
      onSelectAvatar(tempSelected);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Palette size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pilih Avatar Kartun Bawaan
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  Koleksi Ilustrasi
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Klik sekali pada avatar favoritmu untuk langsung menerapkannya ke profil akun
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar: Kategori & Search */}
        <div className="px-6 py-3.5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900">
          {/* Tabs Kategori */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {AVATAR_CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id] || Sparkles;
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'all' 
                ? DEFAULT_AVATARS.length 
                : DEFAULT_AVATARS.filter(a => a.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Kolom Pencarian */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Cari avatar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Grid Avatar */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-950/40">
          {filteredAvatars.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">Tidak ada avatar yang sesuai dengan pencarian "{searchQuery}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
              {filteredAvatars.map((avatar) => {
                const isSelected = tempSelected === avatar.path;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleSelectOne(avatar.path)}
                    title={`Klik untuk memilih ${avatar.name}`}
                    className={`group relative flex flex-col items-center p-2 rounded-xl border-2 transition-all duration-200 text-left bg-white dark:bg-gray-800 hover:shadow-md cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-500 ring-4 ring-blue-500/20 scale-105 shadow-md'
                        : 'border-transparent hover:border-blue-300 dark:hover:border-blue-700 hover:scale-105'
                    }`}
                  >
                    {/* Gambar Avatar */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700/60 p-1 mb-2 flex items-center justify-center">
                      <img
                        src={avatar.path}
                        alt={avatar.name}
                        loading="lazy"
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=fallback';
                        }}
                      />
                      {/* Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-md animate-in zoom-in duration-150">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Label Avatar */}
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            {tempSelected ? (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-blue-500 shadow-sm p-0.5">
                  <img
                    src={tempSelected}
                    alt="Dipilih"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
                  Klik avatar untuk langsung memilih
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Pilih salah satu avatar di atas</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!tempSelected}
              className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Check size={16} /> Terapkan Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
