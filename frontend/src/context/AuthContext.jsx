import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import * as api from "../services/ApiService";

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = api.getStoredUser();
        const hasToken = api.isAuthenticated();

        if (hasToken && storedUser) {
          // Validate token by calling /auth/me
          const currentUser = await api.getCurrentUser();
          setUser(currentUser);
          if (currentUser) {
            localStorage.setItem("user", JSON.stringify(currentUser));
            localStorage.setItem("userId", String(currentUser.id || ""));
            localStorage.setItem("userName", currentUser.display_name || currentUser.username || "");
            localStorage.setItem("userEmail", currentUser.email || "");
            localStorage.setItem("userAvatarPath", currentUser.image_path || "");
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        // Token invalid or expired
        console.error("Session restore failed:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userAvatarPath");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login function
  const login = useCallback(async (username, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await api.login(username, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await api.register(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
