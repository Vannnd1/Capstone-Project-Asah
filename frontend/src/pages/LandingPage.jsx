import React, { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Target,
  Zap,
  TrendingUp,
} from "lucide-react";
import AuthModal from "../components/AuthModal";

// Data untuk Fitur Card
const features = [
  {
    icon: Target,
    title: "Target Belajar Personal",
    desc: "AI menyesuaikan intensitas modul harianmu berdasarkan kecepatan dan kemampuanmu.",
  },
  {
    icon: TrendingUp,
    title: "Analisis Skill Mendalam",
    desc: "Lihat peta kompetensi skillmu dan identifikasi area yang perlu ditingkatkan dengan data.",
  },
  {
    icon: Zap,
    title: "Feedback Instan",
    desc: "Dapatkan saran dan insight cepat dari AI untuk ujian dan aktivitas modulmu.",
  },
];

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialMode, setInitialMode] = useState("login");

  const handleOpenAuthModal = (mode) => {
    setInitialMode(mode);
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  // Called when login/register succeeds (AuthContext handles state)
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* 1. Navbar */}
      <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm fixed top-0 z-50">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BrainCircuit size={24} />
            </div>
            <span className="text-xl font-bold">AI Learning Insight</span>
          </div>
          {/* TOMBOL 1: MASUK */}
          <button
            onClick={() => handleOpenAuthModal("login")}
            className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Masuk
          </button>
        </div>
      </nav>

      {/* 2. Hero Content */}
      <header className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6 border border-blue-100">
            ✨ Platform Belajar Masa Depan
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Belajar Cerdas dengan{" "}
            <span className="text-blue-600">Analisis AI</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10">
            AI kami menganalisis gaya belajarmu dan memberikan target harian
            yang pas.
          </p>

          <div className="h-4"></div>
        </div>
      </header>

      {/* 3. Bagian Fitur */}
      <section
        id="features"
        className="py-20 bg-gray-50 border-t border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitur Utama</h2>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Tingkatkan efisiensi belajarmu dengan alat bantu berbasis kecerdasan
            buatan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 transform hover:scale-[1.02] transition duration-300 text-left"
              >
                <div className="bg-blue-500/10 text-blue-600 p-3 inline-block rounded-xl mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Footer CTA */}
      <footer className="py-12 bg-gray-900 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">
            Siap Mencoba Analisis AI Kami?
          </h2>
          {/* TOMBOL 2: DAFTAR SEKARANG */}
          <button
            onClick={() => handleOpenAuthModal("register")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Daftar Sekarang (Gratis)
          </button>
          <p className="text-sm text-gray-500 mt-6">
            &copy; {new Date().getFullYear()} AI Learning Insight. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* 5. Komponen Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onLogin={handleAuthSuccess}
          onClose={handleCloseAuthModal}
          initialMode={initialMode}
        />
      )}
    </div>
  );
};

export default LandingPage;
