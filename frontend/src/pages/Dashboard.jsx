import React from "react";
import {
  TrendingUp,
  Activity,
  Target as TargetIcon,
  Calendar,
  ChevronDown,
  BookOpen,
  Sparkles,
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

      {/* --- LEARNING STYLE BADGE --- */}
      {telemetry && (
        <div className="p-4 rounded-xl border bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <Sparkles className="text-emerald-600 dark:text-emerald-400" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gaya Belajarmu
              </p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {getLearningStyleLabel(learningStyle)}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-gray-500">Confidence</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {Math.round((telemetry.confidence || 0) * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- STATISTIC CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card Modules Completed */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              Modul Selesai
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.completedModules}
            </p>
          </div>
        </div>
        {/* Card Total Activities */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              Total Aktivitas
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.totalActivities}
            </p>
          </div>
        </div>
        {/* Card Days Active */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:-translate-y-1">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
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
          <div className="p-4 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
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
