import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Target from './pages/Target';
import LandingPage from './pages/LandingPage';
import MyCourses from './pages/MyCourses';
import CourseDetail from './pages/CourseDetail';
import Analytics from './pages/Analytics';
import ProfileSettings from './pages/ProfileSettings'; 

// Import Components
// GANTI Navbar lama dengan Layout baru yang responsif
import Layout from './components/Layout'; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.clear(); // Cara cepat hapus semua data session
        setIsLoggedIn(false);
        window.location.href = '/'; 
    };

    return (
        <Router>
            <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                {!isLoggedIn ? (
                    // 1. JIKA BELUM LOGIN (Landing Page)
                    <Routes>
                        <Route path="*" element={<LandingPage onLogin={handleLogin} />} />
                    </Routes>
                ) : (
                    // 2. JIKA SUDAH LOGIN (Masuk Aplikasi)
                    <Routes>
                        
                        {/* A. HALAMAN UTAMA (DIBUNGKUS LAYOUT) 
                           Halaman ini akan memiliki Sidebar yang responsif (bisa sembunyi di HP).
                        */}
                        <Route path="/" element={
                            <Layout>
                                <Dashboard onLogout={handleLogout} />
                            </Layout>
                        } />

                        <Route path="/courses" element={
                            <Layout>
                                <MyCourses onLogout={handleLogout} />
                            </Layout>
                        } />

                        <Route path="/analytics" element={
                            <Layout>
                                <Analytics onLogout={handleLogout} />
                            </Layout>
                        } />

                        <Route path="/target" element={
                            <Layout>
                                <Target onLogout={handleLogout} />
                            </Layout>
                        } />

                        <Route path="/settings" element={
                            <Layout>
                                <Settings onLogout={handleLogout} />
                            </Layout>
                        } />

                        <Route path="/settings/profile" element={
                            <Layout>
                                <ProfileSettings onLogout={handleLogout} />
                            </Layout>
                        } />

                        {/* B. HALAMAN FULL SCREEN (TANPA LAYOUT/SIDEBAR)
                           Halaman detail kursus butuh fokus penuh, jadi biarkan tanpa wrapper Layout.
                        */}
                        <Route path="/course/:id" element={<CourseDetail />} />

                        {/* Redirect sembarang URL ke Dashboard */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;