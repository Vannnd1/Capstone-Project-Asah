import React, { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Target,
  Zap,
  TrendingUp,
  Globe,
} from "lucide-react";
import AuthModal from "../components/AuthModal";
import { useApp } from "../context/AppContext";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialMode, setInitialMode] = useState("login");
  const { t, language, changeLanguage } = useApp();

  const handleOpenAuthModal = (mode) => {
    setInitialMode(mode);
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const features = [
    {
      icon: Target,
      title: t("landing_feat_1_title"),
      desc: t("landing_feat_1_desc"),
    },
    {
      icon: TrendingUp,
      title: t("landing_feat_2_title"),
      desc: t("landing_feat_2_desc"),
    },
    {
      icon: Zap,
      title: t("landing_feat_3_title"),
      desc: t("landing_feat_3_desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* 1. Navbar */}
      <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm fixed top-0 z-50">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BrainCircuit size={24} />
            </div>
            <span className="text-xl font-bold">{t("app_name")}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher Button */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-bold border border-gray-200">
              <button
                onClick={() => changeLanguage("id")}
                className={`px-2.5 py-1 rounded-md transition ${
                  language === "id"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                ID
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`px-2.5 py-1 rounded-md transition ${
                  language === "en"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                EN
              </button>
            </div>

            {/* TOMBOL: MASUK */}
            <button
              onClick={() => handleOpenAuthModal("login")}
              className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              {t("landing_login_btn")}
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Content */}
      <header className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6 border border-blue-100">
            {t("landing_badge")}
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            {t("landing_hero_title_1")}
            <span className="text-blue-600">{t("landing_hero_title_2")}</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10">
            {t("landing_hero_desc")}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("landing_features_title")}</h2>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {t("landing_features_desc")}
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
            {t("landing_cta_title")}
          </h2>
          {/* TOMBOL 2: DAFTAR SEKARANG */}
          <button
            onClick={() => handleOpenAuthModal("register")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {t("landing_cta_btn")}
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
