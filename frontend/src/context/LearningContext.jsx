import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import * as api from "../services/ApiService";
import { useAuth } from "./AuthContext";
import { useApp } from "./AppContext";
import {
  syncCompletedModulesFromActivities,
  getCompletedModules,
} from "../services/courseProgressService";
import { mockJourneys, mockTutorials } from "../mockData";

// Create context
const LearningContext = createContext(null);

export const TARGET_CONFIGS = {
  santai: {
    key: "santai",
    title: "Santai",
    title_en: "Relaxed",
    modulesPerDay: 1,
    desc: "1 Modul/Hari • Santai",
    desc_en: "1 Module/Day • Relaxed",
    color: "emerald",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
  },
  fokus: {
    key: "fokus",
    title: "Fokus",
    title_en: "Focused",
    modulesPerDay: 3,
    desc: "3 Modul/Hari • Sedang",
    desc_en: "3 Modules/Day • Moderate",
    color: "blue",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  },
  hardcore: {
    key: "hardcore",
    title: "Hardcore",
    title_en: "Hardcore",
    modulesPerDay: 5,
    desc: "5+ Modul/Hari • Intensif",
    desc_en: "5+ Modules/Day • Intensive",
    color: "purple",
    badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700",
  },
};

const SKILL_SUBJECT_MAP = {
  101: "React Core",
  105: "State Management",
  103: "API Integration",
  104: "Cloud & DevOps",
  106: "UI/UX Design",
  102: "Machine Learning",
};

const buildClientSkillMapFallback = (activities = [], target = "fokus", lang = "id", userId = null) => {
  const isEn = lang === "en";
  const completedSet = new Set(getCompletedModules(userId));
  if (Array.isArray(activities)) {
    activities.forEach((a) => {
      if (a.action === "complete") completedSet.add(Number(a.tutorial_id));
    });
  }

  const skills = [101, 105, 103, 104, 106, 102].map((jid) => {
    const journey = mockJourneys.find((j) => j.id === jid);
    const modules = mockTutorials.filter((m) => m.journey_id === jid);
    const total = modules.length || journey?.total_modules || 1;
    const done = modules.filter((m) => completedSet.has(m.id)).length;
    const subs = Array.isArray(activities)
      ? new Set(activities.filter((a) => a.journey_id === jid && a.action === "submit").map((a) => a.tutorial_id)).size
      : 0;
    const views = Array.isArray(activities)
      ? activities.filter((a) => a.journey_id === jid && a.action === "view").length
      : 0;
    const score = Math.min(Math.round((done / total) * 120) + Math.min(subs * 20, 20) + Math.min(views * 3, 10), 150);

    return {
      journey_id: jid,
      subject: SKILL_SUBJECT_MAP[jid],
      course_name: journey?.name || SKILL_SUBJECT_MAP[jid],
      course_name_en: journey?.name_en || journey?.name || SKILL_SUBJECT_MAP[jid],
      category: journey?.category || "Tech",
      score,
      full_mark: 150,
      completed_modules: done,
      total_modules: total,
      completion_pct: Math.round((done / total) * 100),
      submissions: subs,
    };
  });

  const hasActivity = skills.some((s) => s.score > 0);
  const strongest = hasActivity
    ? [...skills].sort((a, b) => b.score - a.score || b.completion_pct - a.completion_pct)[0]
    : null;
  const weakest = hasActivity
    ? [...skills].sort((a, b) => a.score - b.score || a.completion_pct - b.completion_pct)[0]
    : null;

  const totalCurriculum = skills.reduce((sum, s) => sum + s.total_modules, 0);
  const completedTotal = skills.reduce((sum, s) => sum + s.completed_modules, 0);
  const remaining = Math.max(totalCurriculum - completedTotal, 0);
  const cfg = TARGET_CONFIGS[target] || TARGET_CONFIGS.fokus;
  const daysEst = remaining === 0 ? 0 : Math.ceil(remaining / cfg.modulesPerDay);
  const weeksEst = Math.ceil(daysEst / 7);
  const etaText =
    remaining === 0
      ? isEn ? "Curriculum Completed!" : "Kurikulum Tuntas!"
      : daysEst < 7
        ? isEn ? `~${daysEst} ${daysEst === 1 ? "Day" : "Days"}` : `~${daysEst} Hari`
        : isEn ? `~${weeksEst} ${weeksEst === 1 ? "Week" : "Weeks"} (${daysEst} Days)` : `~${weeksEst} Minggu (${daysEst} Hari)`;

  return {
    skills,
    strongest,
    weakest,
    has_activity: hasActivity,
    total_curriculum_modules: totalCurriculum,
    completed_curriculum_modules: completedTotal,
    strength_evaluation: !hasActivity
      ? {
          title: isEn ? "Ready to Build Your Profile" : "Siap Memetakan Kekuatanmu",
          description: isEn
            ? "No modules have been completed on this account yet. Complete your first module in My Courses so AI can map your strengths."
            : "Belum ada modul yang diselesaikan pada akun ini. Selesaikan modul pertamamu di halaman Kelas Saya agar AI dapat mendeteksi kekuatanmu.",
          is_mastered: false,
        }
      : {
          title: isEn ? `Strength in ${strongest.subject}` : `Keunggulan di ${strongest.subject}`,
          description: isEn
            ? `Your ${strongest.subject} score reached ${strongest.score}/150 (${strongest.completed_modules}/${strongest.total_modules} modules completed).`
            : `Skor ${strongest.subject} mencapai ${strongest.score}/150 (${strongest.completed_modules}/${strongest.total_modules} modul selesai).`,
          skill_subject: strongest.subject,
          score: strongest.score,
          full_mark: 150,
          is_mastered: strongest.score >= 120,
        },
    improvement_evaluation: !hasActivity
      ? {
          title: isEn ? "No Competency Data Yet" : "Belum Ada Data Kompetensi",
          description: isEn
            ? "All skill scores are currently 0/150. Start a course in My Courses to generate personalized insights."
            : "Skor kompetensi saat ini masih 0/150. Mulai belajar di Kelas Saya untuk menghasilkan analisis AI personal.",
          is_mastered: false,
        }
      : {
          title: isEn ? `Strengthen ${weakest.subject}` : `Tingkatkan ${weakest.subject}`,
          description: isEn
            ? `Your ${weakest.subject} score is currently ${weakest.score}/150 (${weakest.completed_modules}/${weakest.total_modules} modules completed).`
            : `Skor ${weakest.subject} saat ini ${weakest.score}/150 (${weakest.completed_modules}/${weakest.total_modules} modul selesai).`,
          skill_subject: weakest.subject,
          score: weakest.score,
          full_mark: 150,
          is_mastered: weakest.score >= 120,
        },
    graduation_projection: {
      eta_text: etaText,
      badge: isEn
        ? `${cfg.title_en} Mode (${cfg.modulesPerDay}/day)`
        : `Mode ${cfg.title} (${cfg.modulesPerDay} modul/hari)`,
      description:
        remaining === 0
          ? isEn
            ? `Congratulations! You have completed all ${totalCurriculum} modules.`
            : `Selamat! Kamu telah menuntaskan seluruh ${totalCurriculum} modul.`
          : isEn
            ? `You have completed ${completedTotal} of ${totalCurriculum} modules (${remaining} remaining). Projected completion in ${etaText}.`
            : `Kamu telah menyelesaikan ${completedTotal} dari ${totalCurriculum} modul (${remaining} modul tersisa). Estimasi selesai dalam ${etaText}.`,
      remaining_modules: remaining,
      completed_modules: completedTotal,
      total_modules: totalCurriculum,
      days_estimated: daysEst,
    },
  };
};

export const LearningProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { language } = useApp();

  // Learning target state
  const [learningTarget, setLearningTargetState] = useState(
    user?.learning_target || localStorage.getItem("user_target") || "fokus"
  );

  useEffect(() => {
    if (user?.learning_target) {
      setLearningTargetState(user.learning_target);
      localStorage.setItem("user_target", user.learning_target);
    }
  }, [user]);

  // State for learning data
  const [telemetry, setTelemetry] = useState(null);
  const [skillMap, setSkillMap] = useState(null);
  const [insight, setInsight] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [insightHistory, setInsightHistory] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasLoadedOnceRef = useRef(false);
  const activityHistoryRef = useRef([]);

  // Fetch telemetry data
  const fetchTelemetry = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const data = await api.getTelemetry();
      setTelemetry(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch telemetry:", err);
      setError(err.message);
      return null;
    }
  }, [isAuthenticated]);

  // Fetch activity history and keep local course progress synced per account
  const fetchActivityHistory = useCallback(
    async (limit = 200) => {
      if (!isAuthenticated) return [];
      try {
        const data = await api.getActivityHistory(limit);
        const list = Array.isArray(data) ? data : [];
        activityHistoryRef.current = list;
        setActivityHistory(list);
        syncCompletedModulesFromActivities(list, user?.id);
        return list;
      } catch (err) {
        console.error("Failed to fetch activity history:", err);
        setError(err.message);
        return [];
      }
    },
    [isAuthenticated, user?.id]
  );

  // Fetch skill map derived from real account activities
  const fetchSkillMap = useCallback(
    async (overrideActivities = null) => {
      if (!isAuthenticated) return null;
      try {
        const data = await api.getSkillMap(language);
        setSkillMap(data);
        return data;
      } catch (err) {
        console.warn("Fallback computing skill map client-side:", err);
        const fallback = buildClientSkillMapFallback(
          overrideActivities || activityHistoryRef.current,
          learningTarget,
          language,
          user?.id
        );
        setSkillMap(fallback);
        return fallback;
      }
    },
    [isAuthenticated, language, learningTarget, user?.id]
  );

  // Fetch AI insight
  const fetchInsight = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const data = await api.getInsight(language);
      setInsight(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch insight:", err);
      setError(err.message);
      return null;
    }
  }, [isAuthenticated, language]);

  // Fetch recommendations
  const fetchRecommendations = useCallback(
    async (n = 5) => {
      if (!isAuthenticated) return [];
      try {
        const data = await api.getRecommendations(n, language);
        setRecommendations(data.recommendations || []);
        return data;
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError(err.message);
        return [];
      }
    },
    [isAuthenticated, language]
  );

  // Fetch insight history
  const fetchInsightHistory = useCallback(
    async (limit = 10, offset = 0) => {
      if (!isAuthenticated) return [];
      try {
        const data = await api.getInsightHistory(limit, offset, language);
        setInsightHistory(data.insights || []);
        return data;
      } catch (err) {
        console.error("Failed to fetch insight history:", err);
        setError(err.message);
        return [];
      }
    },
    [isAuthenticated, language]
  );

  // Refresh all learning data (optionally silently without full-page spinner)
  const fetchAllData = useCallback(async ({ silent = false } = {}) => {
    if (!isAuthenticated) return;
    if (!silent) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const activities = await fetchActivityHistory(200);
      await Promise.all([
        fetchTelemetry(),
        fetchSkillMap(activities),
        fetchInsight(),
        fetchRecommendations(),
      ]);
      hasLoadedOnceRef.current = true;
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, fetchActivityHistory, fetchTelemetry, fetchSkillMap, fetchInsight, fetchRecommendations]);

  // Log new activity
  const logActivity = useCallback(
    async (activityData) => {
      if (!isAuthenticated) return null;
      try {
        const data = await api.logActivity(activityData);
        await fetchAllData({ silent: true });
        return data;
      } catch (err) {
        console.error("Failed to log activity:", err);
        setError(err.message);
        return null;
      }
    },
    [isAuthenticated, fetchAllData]
  );

  // Auto-fetch data when user authenticates or switches account
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllData({ silent: false });
    } else {
      hasLoadedOnceRef.current = false;
      activityHistoryRef.current = [];
      setTelemetry(null);
      setSkillMap(null);
      setInsight(null);
      setRecommendations([]);
      setActivityHistory([]);
      setInsightHistory([]);
    }
  }, [isAuthenticated, user?.id]);

  // Refresh AI insight, skillMap, and recommendations when language switches
  useEffect(() => {
    if (isAuthenticated && user && hasLoadedOnceRef.current) {
      Promise.all([
        fetchSkillMap(),
        fetchInsight(),
        fetchRecommendations(),
      ]);
    }
  }, [language]);

  // Listen to module completions & quiz submissions so AI Insight & Skill Map stay live
  useEffect(() => {
    if (!isAuthenticated || !user) return undefined;

    const handleProgressChange = () => {
      fetchAllData({ silent: true });
    };

    window.addEventListener("course-progress-updated", handleProgressChange);
    window.addEventListener("course-activity-logged", handleProgressChange);
    return () => {
      window.removeEventListener("course-progress-updated", handleProgressChange);
      window.removeEventListener("course-activity-logged", handleProgressChange);
    };
  }, [isAuthenticated, user?.id, fetchAllData]);

  // Save learning target
  const saveLearningTarget = useCallback(async (newTarget) => {
    setLearningTargetState(newTarget);
    localStorage.setItem("user_target", newTarget);
    try {
      await api.updateLearningTarget(newTarget);
      await Promise.all([fetchInsight(), fetchSkillMap()]);
    } catch (err) {
      console.warn("Could not sync target to server:", err);
    }
  }, [fetchInsight, fetchSkillMap]);

  // Target progress computation
  const targetConfig = TARGET_CONFIGS[learningTarget] || TARGET_CONFIGS.fokus;
  const todayDone = telemetry?.user_metrics?.today_completed_modules ?? 0;

  const targetProgress = {
    targetKey: learningTarget,
    config: targetConfig,
    quota: targetConfig.modulesPerDay,
    completedToday: todayDone,
    percentage: Math.min(Math.round((todayDone / targetConfig.modulesPerDay) * 100), 100),
    isAchieved: todayDone >= targetConfig.modulesPerDay,
    remaining: Math.max(targetConfig.modulesPerDay - todayDone, 0),
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Helper to get learning style color
  const getLearningStyleColor = (style) => {
    const colors = {
      fast_learner: "green",
      consistent_learner: "blue",
      reflective_learner: "purple",
      passive_learner: "amber",
    };
    return colors[style] || "gray";
  };

  // Helper to get learning style label (Bilingual)
  const getLearningStyleLabel = (style, lang = "id") => {
    const labelsId = {
      fast_learner: "Pembelajar Cepat",
      consistent_learner: "Pembelajar Konsisten",
      reflective_learner: "Pembelajar Reflektif",
      passive_learner: "Pembelajar Pasif",
    };
    const labelsEn = {
      fast_learner: "Fast Learner",
      consistent_learner: "Consistent Learner",
      reflective_learner: "Reflective Learner",
      passive_learner: "Passive Learner",
    };
    const labels = lang === "en" ? labelsEn : labelsId;
    return labels[style] || style;
  };

  const value = {
    // Data
    telemetry,
    skillMap,
    insight,
    recommendations,
    activityHistory,
    insightHistory,
    learningTarget,
    targetProgress,
    TARGET_CONFIGS,

    // States
    isLoading,
    error,

    // Functions
    fetchTelemetry,
    fetchSkillMap,
    fetchInsight,
    fetchRecommendations,
    fetchInsightHistory,
    fetchActivityHistory,
    logActivity,
    fetchAllData,
    saveLearningTarget,
    clearError,

    // Helpers
    getLearningStyleColor,
    getLearningStyleLabel,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

// Custom hook for using learning context
export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
};

export default LearningContext;
