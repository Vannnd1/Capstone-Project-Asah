import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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
import Navbar from './components/Navbar'; 


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    // FUNGSI LOGOUT DIDEFINISIKAN DI SINI
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');      
        localStorage.removeItem('userAvatarPath'); 
        
        setIsLoggedIn(false);
        window.location.href = '/'; 
    };

    return (
        <Router>
            {/* KRUSIAL: Tambahkan kelas 'render-fix' di sini untuk menghilangkan garis */}
            <div className="min-h-screen font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 render-fix">
                {!isLoggedIn ? (
                    <Routes>
                        <Route path="*" element={<LandingPage onLogin={handleLogin} />} />
                    </Routes>
                ) : (
                    // TERUSKAN handleLogout sebagai PROP ke MainLayout
                    <MainLayout onLogout={handleLogout} /> 
                )}
            </div>
        </Router>
    );
}

const MainLayout = ({ onLogout }) => { // TERIMA onLogout dari App
    const location = useLocation(); 
    const isLearningMode = location.pathname.startsWith('/course/');

    return (
        <div className="flex min-h-screen">
            {!isLearningMode && (
                <Navbar /> 
            )}

            <main className={`flex-1 ${!isLearningMode ? 'p-8 ml-64' : ''}`}>
                <Routes>
                    {/* KRUSIAL: TERUSKAN onLogout ke SEMUA halaman utama */}
                    <Route path="/" element={<Dashboard onLogout={onLogout} />} /> 
                    <Route path="/courses" element={<MyCourses onLogout={onLogout} />} />
                    <Route path="/course/:id" element={<CourseDetail />} />
                    <Route path="/analytics" element={<Analytics onLogout={onLogout} />} /> 
                    <Route path="/target" element={<Target onLogout={onLogout} />} /> 
                    
                    {/* KRUSIAL: TAMBAHKAN onLogout ke Settings dan ProfileSettings */}
                    <Route path="/settings" element={<Settings onLogout={onLogout} />} />
                    <Route path="/settings/profile" element={<ProfileSettings onLogout={onLogout} />} /> 
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;