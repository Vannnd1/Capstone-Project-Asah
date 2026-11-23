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
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/LearningContext";
import HeaderAvatar from "../components/HeaderAvatar";
import { mockSkills, mockJourneys } from "../mockData";
import { localizeInsightText, localizeRecommendationReason } from "../utils/localizeInsight";

const Analytics = ({ onLogout }) => {
  const { darkMode, t, language } = useApp();
  const { user } = useAuth();
  const {
    telemetry,
    insight,
    recommendations,
    fetchInsightHistory,
    isLoading,
    getLearningStyleLabel,
    learningTarget,
  } = useLearning();

  const axisColor = darkMode ? "#9CA3AF" : "#4B5563";
  const gridColor = darkMode ? "#374151" : "#E5E7EB";

  // Fetch insight history on mount
  useEffect(() => {
    fetchInsightHistory(5, 0);
  }, [fetchInsightHistory]);

  const learningStyle = telemetry?.learning_style || "fast_learner";
  const metrics = telemetry?.user_metrics || {};
  const confidence = telemetry?.confidence || 0.89;

  // Static styling mapping to avoid Tailwind purge bug in production
  const styleConfig = {
    fast_learner: {
      gradient: "bg-gradient-to-br from-emerald-600 to-teal-800",
      icon: TrendingUp,
      title: t("fast_learner_title"),
      desc: t("fast_learner_desc"),
    },
    consistent_learner: {
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-800",
      icon: CheckCircle,
      title: t("consistent_learner_title"),
      desc: t("consistent_learner_desc"),
    },
    reflective_learner: {
      gradient: "bg-gradient-to-br from-purple-600 to-indigo-900",
      icon: BrainCircuit,
      title: t("reflective_learner_title"),
      desc: t("reflective_learner_desc"),
    },
    passive_learner: {
      gradient: "bg-gradient-to-br from-amber-600 to-orange-800",
      icon: AlertTriangle,
      title: t("passive_learner_title"),
      desc: t("passive_learner_desc"),
    },
  };

  const currentConfig = styleConfig[learningStyle] || styleConfig.fast_learner;
  const StyleIcon = currentConfig.icon;

  const targetProjections = {
    santai: {
      eta: t("target_santai_eta"),
      badge: t("projection_santai_badge"),
      desc: t("projection_santai_desc"),
    },
    fokus: {
      eta: t("target_fokus_eta"),
      badge: t("projection_fokus_badge"),
      desc: t("projection_fokus_desc"),
    },
    hardcore: {
      eta: t("target_hardcore_eta"),
      badge: t("projection_hardcore_badge"),
      desc: t("projection_hardcore_desc"),
    },
  };
  const currentProjection = targetProjections[learningTarget] || targetProjections.fokus;

  const localizedInsightText = localizeInsightText(insight?.insight_text, language);

  const getRecName = (rec) => {
    if (language === 'en') {
      const match = mockJourneys.find(j => j.id === rec.journey_id || j.name === rec.name);
      if (match?.name_en) return match.name_en;
    }
    return rec.name;
  };

  if (isLoading && !telemetry) {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-4 h-96">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">{t("analytics_loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Bagian Atas */}
      <HeaderAvatar onLogout={onLogout}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="text-purple-600" />
            {t("analytics_title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("analytics_subtitle")}
          </p>
        </div>
      </HeaderAvatar>

      {/* --- 1. LEARNING STYLE HERO CARD --- */}
      <div
        className={`relative overflow-hidden p-6 md:p-8 rounded-2xl ${currentConfig.gradient} text-white shadow-xl`}
      >
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Sparkles size={240} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                <StyleIcon size={36} className="text-white" />
              </div>
              <div>
                <span className="inline-block text-xs uppercase tracking-wider font-semibold bg-white/20 px-3 py-1 rounded-full mb-1">
                  {t("learning_style_detected")}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {getLearningStyleLabel(learningStyle, language)}
                </h2>
                <p className="text-white/80 text-sm mt-0.5">{currentConfig.desc}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 text-left md:text-right shrink-0">
              <p className="text-xs text-white/80 uppercase font-medium">{t("confidence_score")}</p>
              <p className="text-3xl font-black text-white">
                {Math.round(confidence * 100)}%
              </p>
            </div>
          </div>

          {/* AI Insight Paragraph */}
          {localizedInsightText && (
            <div className="mt-5 pt-4 border-t border-white/20 flex items-start gap-3">
              <Sparkles className="text-yellow-300 shrink-0 mt-1" size={20} />
              <p className="text-white/95 leading-relaxed text-sm md:text-base font-medium">
                "{localizedInsightText}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- 2. LAYOUT GRID 2 KOLOM (PETA SKILL + 3 KARTU EVALUASI AI) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* --- KOLOM KIRI: GRAFIK RADAR PETA KOMPETENSI SKILL --- */}
        <div className="bg-white dark:bg-gray-800 p-6 md:p-7 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <Layers className="text-blue-600" size={20} />
                {t("skill_map_title")}
              </h3>
              <span className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold px-2.5 py-1 rounded-full">
                {t("live_data")}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {t("skill_map_desc")}
            </p>
          </div>

          {/* Radar Container */}
          <div className="h-80 w-full flex justify-center items-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="68%"
                data={mockSkills}
                margin={{ top: 20, right: 35, bottom: 20, left: 35 }}
              >
                <PolarGrid stroke={gridColor} strokeDasharray="3 3" />
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
                  name={user?.display_name || "Siswa"}
                  dataKey="A"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="#3B82F6"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Ringkasan Bawah Radar */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <p className="font-bold">{t("strongest_skill")}</p>
              <p className="font-medium">React Core (120/150)</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-300">
              <p className="font-bold">{t("focus_improvement")}</p>
              <p className="font-medium">Testing & QA (65/150)</p>
            </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: 3 KARTU EVALUASI AI ASLI YANG DIKEMBALIKAN --- */}
        <div className="flex flex-col gap-5 justify-between">
          
          {/* Kartu 1: Kekuatan Utama */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-4 shadow-sm hover:shadow-md transition">
            <div className="bg-emerald-100 dark:bg-emerald-800/60 p-3.5 rounded-xl text-emerald-700 dark:text-emerald-300 shrink-0">
              <CheckCircle size={28} />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wide uppercase text-emerald-700 dark:text-emerald-400">
                {t("card_strength_badge")}
              </span>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-lg mt-0.5">
                {t("card_strength_title")}
              </h4>
              <p className="text-emerald-800 dark:text-emerald-300 mt-1 text-sm leading-relaxed">
                {t("card_strength_desc")}
              </p>
            </div>
          </div>

          {/* Kartu 2: Area Perbaikan */}
          <div className="bg-amber-50/70 dark:bg-amber-950/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-start gap-4 shadow-sm hover:shadow-md transition">
            <div className="bg-amber-100 dark:bg-amber-800/60 p-3.5 rounded-xl text-amber-700 dark:text-amber-300 shrink-0">
              <AlertTriangle size={28} />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wide uppercase text-amber-700 dark:text-amber-400">
                {t("card_improvement_badge")}
              </span>
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-lg mt-0.5">
                {t("card_improvement_title")}
              </h4>
              <p className="text-amber-800 dark:text-amber-300 mt-1 text-sm leading-relaxed">
                {t("card_improvement_desc")}
              </p>
            </div>
          </div>

          {/* Kartu 3: Estimasi Kelulusan Berdasarkan Target */}
          <div className="bg-purple-50/70 dark:bg-purple-950/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800 flex items-start gap-4 shadow-sm hover:shadow-md transition">
            <div className="bg-purple-100 dark:bg-purple-800/60 p-3.5 rounded-xl text-purple-700 dark:text-purple-300 shrink-0">
              <Calendar size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wide uppercase text-purple-700 dark:text-purple-400">
                  {t("card_projection_badge")}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {currentProjection.badge}
                </span>
              </div>
              <h4 className="font-bold text-purple-900 dark:text-purple-200 text-lg mt-1">
                {t("card_projection_title", { eta: currentProjection.eta })}
              </h4>
              <p className="text-purple-800 dark:text-purple-300 mt-1 text-sm leading-relaxed">
                {currentProjection.desc}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- 3. REKOMENDASI COURSE BERDASARKAN AI RECOMMANDATION ENGINE --- */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 rounded-2xl text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-yellow-300" size={22} />
              <h3 className="font-bold text-lg">{t("next_course_recommendations")}</h3>
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
              Market Basket Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/15 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold bg-white/25 px-2 py-0.5 rounded">
                    {t("recommendation_choice", { num: idx + 1 })}
                  </span>
                  <span className="text-xs text-yellow-300 font-semibold">
                    {t("match_score", { score: Math.round(rec.score * 100) })}
                  </span>
                </div>
                <h4 className="font-bold text-sm mb-1">{getRecName(rec)}</h4>
                <p className="text-xs text-white/80 line-clamp-2">
                  {localizeRecommendationReason(rec.reason, language)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
