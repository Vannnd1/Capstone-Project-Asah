import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import Providers
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LearningProvider } from "./context/LearningContext";

// Import Pages
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Target from "./pages/Target";
import LandingPage from "./pages/LandingPage";
import MyCourses from "./pages/MyCourses";
import CourseDetail from "./pages/CourseDetail";
import Analytics from "./pages/Analytics";
import ProfileSettings from "./pages/ProfileSettings";

// Import Components
import Layout from "./components/Layout";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
    </div>
  </div>
);

// Main App Router (wrapped inside AuthProvider)
const AppRouter = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {!isAuthenticated ? (
        // JIKA BELUM LOGIN (Landing Page)
        <Routes>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      ) : (
        // JIKA SUDAH LOGIN (Masuk Aplikasi)
        <LearningProvider>
          <Routes>
            {/* HALAMAN UTAMA (DIBUNGKUS LAYOUT) */}
            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard onLogout={handleLogout} />
                </Layout>
              }
            />

            <Route
              path="/courses"
              element={
                <Layout>
                  <MyCourses onLogout={handleLogout} />
                </Layout>
              }
            />

            <Route
              path="/analytics"
              element={
                <Layout>
                  <Analytics onLogout={handleLogout} />
                </Layout>
              }
            />

            <Route
              path="/target"
              element={
                <Layout>
                  <Target onLogout={handleLogout} />
                </Layout>
              }
            />

            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings onLogout={handleLogout} />
                </Layout>
              }
            />

            <Route
              path="/settings/profile"
              element={
                <Layout>
                  <ProfileSettings onLogout={handleLogout} />
                </Layout>
              }
            />

            {/* HALAMAN FULL SCREEN (TANPA LAYOUT/SIDEBAR) */}
            <Route path="/course/:id" element={<CourseDetail />} />

            {/* Redirect sembarang URL ke Dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LearningProvider>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <AppRouter />
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
