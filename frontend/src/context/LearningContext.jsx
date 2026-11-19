import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import * as api from "../services/ApiService";
import { useAuth } from "./AuthContext";

// Create context
const LearningContext = createContext(null);

export const TARGET_CONFIGS = {
  santai: {
    key: "santai",
    title: "Santai",
    modulesPerDay: 1,
    desc: "1 Modul/Hari • Santai",
    color: "emerald",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
  },
  fokus: {
    key: "fokus",
    title: "Fokus",
    modulesPerDay: 3,
    desc: "3 Modul/Hari • Sedang",
    color: "blue",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  },
  hardcore: {
    key: "hardcore",
    title: "Hardcore",
    modulesPerDay: 5,
    desc: "5+ Modul/Hari • Intensif",
    color: "purple",
    badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700",
  },
};

export const LearningProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

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
  const [insight, setInsight] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [insightHistory, setInsightHistory] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Fetch AI insight
  const fetchInsight = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const data = await api.getInsight();
      setInsight(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch insight:", err);
      setError(err.message);
      return null;
    }
  }, [isAuthenticated]);

  // Fetch recommendations
  const fetchRecommendations = useCallback(
    async (n = 5) => {
      if (!isAuthenticated) return [];
      try {
        const data = await api.getRecommendations(n);
        setRecommendations(data.recommendations || []);
        return data;
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError(err.message);
        return [];
      }
    },
    [isAuthenticated]
  );

  // Fetch insight history
  const fetchInsightHistory = useCallback(
    async (limit = 10, offset = 0) => {
      if (!isAuthenticated) return [];
      try {
        const data = await api.getInsightHistory(limit, offset);
        setInsightHistory(data.insights || []);
        return data;
      } catch (err) {
        console.error("Failed to fetch insight history:", err);
        setError(err.message);
        return [];
      }
    },
    [isAuthenticated]
  );

  // Fetch activity history
  const fetchActivityHistory = useCallback(
    async (limit = 50) => {
      if (!isAuthenticated) return [];
      try {
        const data = await api.getActivityHistory(limit);
        setActivityHistory(data || []);
        return data;
      } catch (err) {
        console.error("Failed to fetch activity history:", err);
        setError(err.message);
        return [];
      }
    },
    [isAuthenticated]
  );

  // Log new activity
  const logActivity = useCallback(
    async (activityData) => {
      if (!isAuthenticated) return null;
      try {
        const data = await api.logActivity(activityData);
        // Refresh activity history
        await fetchActivityHistory();
        return data;
      } catch (err) {
        console.error("Failed to log activity:", err);
        setError(err.message);
        return null;
      }
    },
    [isAuthenticated, fetchActivityHistory]
  );

  // Fetch all learning data
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchTelemetry(),
        fetchInsight(),
        fetchRecommendations(),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchTelemetry, fetchInsight, fetchRecommendations]);

  // Auto-fetch data when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllData();
    } else {
      // Clear data on logout
      setTelemetry(null);
      setInsight(null);
      setRecommendations([]);
      setActivityHistory([]);
      setInsightHistory([]);
    }
  }, [isAuthenticated, user, fetchAllData]);

  // Save learning target
  const saveLearningTarget = useCallback(async (newTarget) => {
    setLearningTargetState(newTarget);
    localStorage.setItem("user_target", newTarget);
    try {
      await api.updateLearningTarget(newTarget);
      // Re-fetch insight so AI advice immediately adapts to the new target
      await fetchInsight();
    } catch (err) {
      console.warn("Could not sync target to server:", err);
    }
  }, [fetchInsight]);

  // Target progress computation
  const targetConfig = TARGET_CONFIGS[learningTarget] || TARGET_CONFIGS.fokus;
  const todayDone = telemetry?.user_metrics?.today_completed_modules !== undefined
    ? telemetry.user_metrics.today_completed_modules
    : 1;

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

  // Helper to get learning style label (Indonesian)
  const getLearningStyleLabel = (style) => {
    const labels = {
      fast_learner: "Pembelajar Cepat",
      consistent_learner: "Pembelajar Konsisten",
      reflective_learner: "Pembelajar Reflektif",
      passive_learner: "Pembelajar Pasif",
    };
    return labels[style] || style;
  };

  const value = {
    // Data
    telemetry,
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
