import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Activity,
  Target as TargetIcon,
  Calendar,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/LearningContext";
import AvatarDropdown from "../components/AvatarDropdown";
import ProgressChart from "../components/ProgressChart";
import AIInsightCard from "../components/AIInsightCard";

const Dashboard = ({ onLogout }) => {
  const { t } = useApp();
  const { user } = useAuth();
  const {
    telemetry,
    insight,
    recommendations,
    isLoading,
    getLearningStyleColor,
    getLearningStyleLabel,
    targetProgress,
  } = useLearning();

  // User info
  const userName = user?.display_name || user?.username || "Siswa";
  const userImagePath =
    user?.image_path || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

  // Derived data from telemetry
  const learningStyle = telemetry?.learning_style || "unknown";
  const metrics = telemetry?.user_metrics || {};
  const behaviorAnalysis = telemetry?.behavior_analysis || {};

  // Transform insight for AIInsightCard
  const insightData = {
    text: insight?.insight_text || "Memuat insight AI...",
    color: getLearningStyleColor(insight?.learning_style || learningStyle),
  };

  // Stats from telemetry
  const stats = {
    completedModules: metrics.completed_modules || 0,
    totalActivities: metrics.total_activities || 0,
    engagementScore: metrics.engagement_score || 0,
    daysActive: metrics.days_active || 0,
  };

  if (isLoading)
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-4 h-96">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Menyiapkan data belajar personalmu...</p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("welcome")}, {userName}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("progressMsg")}
          </p>
        </div>
        <AvatarDropdown
          onLogout={onLogout}
          userImagePath={userImagePath}
          userName={userName}
        />
      </header>

      {/* --- TOP BANNER GRID: LEARNING STYLE & LEARNING TARGET --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Gaya Belajar */}
        {telemetry && (
          <div className="p-5 rounded-2xl border bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <Sparkles size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Gaya Belajarmu
              </p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 truncate">
                {getLearningStyleLabel(learningStyle)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                {Math.round((telemetry.confidence || 0) * 100)}%
              </p>
            </div>
          </div>
        )}

        {/* Card 2: Target Belajar Harian & Progress */}
        <div className="p-5 rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 flex flex-col justify-between gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                <TargetIcon size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Target Belajar Harian
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-900 dark:text-blue-200 capitalize">
                    Mode {targetProgress?.config?.title || "Fokus"}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {targetProgress?.quota || 3} Modul/Hari
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/target"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-0.5 transition bg-white/70 dark:bg-gray-800/80 px-2.5 py-1.5 rounded-lg border border-blue-100 dark:border-gray-700"
            >
              Ubah <ChevronRight size={13} />
            </Link>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1.5">
                Progres: <strong>{targetProgress?.completedToday || 0} / {targetProgress?.quota || 3}</strong> modul
                {targetProgress?.isAchieved && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                    Tercapai
                  </span>
                )}
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {targetProgress?.percentage || 0}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-blue-200/50 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${targetProgress?.percentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATISTIC CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card Target Hari Ini */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
            <TargetIcon size={28} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              Target Hari Ini
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {targetProgress?.completedToday || 0} / {targetProgress?.quota || 3}{" "}
              <span className="text-xs font-normal text-gray-500">modul</span>
            </p>
            <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
              {targetProgress?.isAchieved ? "🎉 Target tercapai!" : `Kurang ${targetProgress?.remaining || 0} lagi`}
            </p>
          </div>
        </div>

        {/* Card Modules Completed */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              Total Modul Selesai
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.completedModules}
            </p>
          </div>
        </div>

        {/* Card Days Active */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              Hari Aktif
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.daysActive}{" "}
              <span className="text-sm font-normal text-gray-500">hari</span>
            </p>
          </div>
        </div>

        {/* Card Engagement Score */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              Engagement
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.engagementScore}
            </p>
          </div>
        </div>
      </div>

      {/* --- INSIGHT & RECOMMENDATIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Insight */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AIInsightCard insight={insightData} />

          {/* Behavior Analysis Cards */}
          {behaviorAnalysis.consistency && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Konsistensi
                </p>
                <p className="font-bold text-gray-900 dark:text-white capitalize">
                  {behaviorAnalysis.consistency?.replace("_", " ")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Kecepatan
                </p>
                <p className="font-bold text-gray-900 dark:text-white capitalize">
                  {behaviorAnalysis.velocity?.replace("_", " ")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Engagement
                </p>
                <p className="font-bold text-gray-900 dark:text-white capitalize">
                  {behaviorAnalysis.engagement_level?.replace("_", " ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Recommendations */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles size={20} />
              Rekomendasi Course
            </h3>
            {recommendations.length > 0 ? (
              <ul className="space-y-3">
                {recommendations.slice(0, 3).map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{rec.name}</p>
                      <p className="text-blue-200 text-xs">
                        Score: {Math.round(rec.score * 100)}%
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-blue-100 text-sm opacity-90">
                Tidak ada rekomendasi saat ini. Terus belajar untuk mendapatkan
                rekomendasi personal!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
