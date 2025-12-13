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

export const LearningProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

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
