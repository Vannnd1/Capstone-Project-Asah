import React, { useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Clock,
  BookOpen,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/LearningContext";
import HeaderAvatar from "../components/HeaderAvatar";

const Analytics = ({ onLogout }) => {
  const { darkMode } = useApp();
  const { user } = useAuth();
  const {
    telemetry,
    insight,
    recommendations,
    insightHistory,
    fetchInsightHistory,
    isLoading,
    getLearningStyleColor,
    getLearningStyleLabel,
  } = useLearning();

  const axisColor = darkMode ? "#9CA3AF" : "#4B5563";
  const gridColor = darkMode ? "#374151" : "#E5E7EB";

  // Fetch insight history on mount
  useEffect(() => {
    fetchInsightHistory(5, 0);
  }, [fetchInsightHistory]);

  // Derived data
  const learningStyle = telemetry?.learning_style || "unknown";
  const metrics = telemetry?.user_metrics || {};
  const behaviorAnalysis = telemetry?.behavior_analysis || {};
  const confidence = telemetry?.confidence || 0;

  // Transform metrics to radar chart data
  const radarData = [
    {
      subject: "Konsistensi",
      A:
        behaviorAnalysis.consistency === "very_high"
          ? 140
          : behaviorAnalysis.consistency === "high"
          ? 110
          : behaviorAnalysis.consistency === "medium"
          ? 80
          : 50,
      fullMark: 150,
    },
    {
      subject: "Kecepatan",
      A:
        behaviorAnalysis.velocity === "very_fast"
          ? 140
          : behaviorAnalysis.velocity === "fast"
          ? 110
          : behaviorAnalysis.velocity === "medium"
          ? 80
          : 50,
      fullMark: 150,
    },
    {
      subject: "Engagement",
      A:
        behaviorAnalysis.engagement_level === "excellent"
          ? 140
          : behaviorAnalysis.engagement_level === "good"
          ? 110
          : behaviorAnalysis.engagement_level === "medium"
          ? 80
          : 50,
      fullMark: 150,
    },
    {
      subject: "Modul",
      A: Math.min(metrics.completed_modules * 2 || 0, 150),
      fullMark: 150,
    },
    {
      subject: "Aktivitas",
      A: Math.min(metrics.total_activities / 3 || 0, 150),
      fullMark: 150,
    },
    {
      subject: "Hari Aktif",
      A: Math.min(metrics.days_active * 5 || 0, 150),
      fullMark: 150,
    },
  ];

  // Color mapping for styles
  const styleColors = {
    fast_learner: { primary: "green", icon: TrendingUp },
    consistent_learner: { primary: "blue", icon: CheckCircle },
    reflective_learner: { primary: "purple", icon: BrainCircuit },
    passive_learner: { primary: "amber", icon: AlertTriangle },
  };

  const currentStyle =
    styleColors[learningStyle] || styleColors.consistent_learner;

  if (isLoading && !telemetry) {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-4 h-96">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Menganalisis data belajarmu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Bagian Atas */}
      <HeaderAvatar onLogout={onLogout}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="text-purple-600" />
            Analisis AI Mendalam
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Laporan detail mengenai gaya belajar dan potensimu.
          </p>
        </div>
      </HeaderAvatar>

      {/* Learning Style Hero Card */}
      {telemetry && (
        <div
          className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-${currentStyle.primary}-500 to-${currentStyle.primary}-700 text-white shadow-xl`}
        >
          <div className="absolute top-0 right-0 opacity-10">
            <Sparkles size={200} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <currentStyle.icon size={32} />
              </div>
              <div>
                <p className="text-sm opacity-80">Gaya Belajar Terdeteksi</p>
                <h2 className="text-3xl font-bold">
                  {getLearningStyleLabel(learningStyle)}
                </h2>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm opacity-80">Tingkat Kepercayaan</p>
                <p className="text-3xl font-bold">
                  {Math.round(confidence * 100)}%
                </p>
              </div>
            </div>
            {insight && (
              <p className="mt-4 text-white/90 leading-relaxed max-w-2xl">
                {insight.insight_text}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Layout Grid 2 Kolom (50:50) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* --- KOLOM KIRI: GRAFIK RADAR --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col justify-center">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-center text-lg">
            Peta Kompetensi
          </h3>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
            Visualisasi metrik belajarmu.
          </p>

          {/* Container Grafik */}
          <div className="h-96 w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="65%"
                data={radarData}
                margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
              >
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: axisColor, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name={user?.display_name || "User"}
                  dataKey="A"
                  stroke="#8884d8"
                  strokeWidth={3}
                  fill="#8884d8"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- KOLOM KANAN: KARTU ANALISIS & INSIGHT HISTORY --- */}
        <div className="space-y-5">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-600" size={24} />
                <div>
                  <p className="text-xs text-gray-500">Modul Selesai</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {metrics.completed_modules || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="text-purple-600" size={24} />
                <div>
                  <p className="text-xs text-gray-500">Hari Aktif</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {metrics.days_active || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Behavior Analysis */}
          {behaviorAnalysis.consistency && (
            <>
              <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <h4 className="font-bold text-green-800 dark:text-green-300">
                    Konsistensi:{" "}
                    {behaviorAnalysis.consistency?.replace("_", " ")}
                  </h4>
                </div>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  Kamu menunjukkan pola belajar yang{" "}
                  {behaviorAnalysis.consistency === "very_high"
                    ? "sangat konsisten"
                    : behaviorAnalysis.consistency === "high"
                    ? "konsisten"
                    : "perlu ditingkatkan"}
                  .
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-blue-600" size={20} />
                  <h4 className="font-bold text-blue-800 dark:text-blue-300">
                    Kecepatan: {behaviorAnalysis.velocity?.replace("_", " ")}
                  </h4>
                </div>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  Velocity belajarmu{" "}
                  {behaviorAnalysis.velocity === "very_fast"
                    ? "sangat cepat"
                    : behaviorAnalysis.velocity === "fast"
                    ? "cepat"
                    : "normal"}
                  .
                </p>
              </div>
            </>
          )}

          {/* Insight History */}
          {insightHistory.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" />
                Riwayat Insight AI
              </h4>
              <ul className="space-y-2">
                {insightHistory.slice(0, 3).map((item) => (
                  <li
                    key={item.id}
                    className="text-sm text-gray-600 dark:text-gray-400 border-l-2 border-purple-300 pl-3"
                  >
                    {item.insight_text?.substring(0, 100)}...
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-xl text-white">
              <h4 className="font-bold mb-3">🎯 Rekomendasi Course</h4>
              <ul className="space-y-2">
                {recommendations.slice(0, 3).map((rec, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="bg-white/20 px-2 py-0.5 rounded">
                      {idx + 1}
                    </span>
                    <span>{rec.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
