import { NavLink } from 'react-router-dom';
import { BrainCircuit, Home, BookOpen, BarChart3, Target } from 'lucide-react'; 
import { useApp } from '../context/AppContext'; 

// DAFTAR ITEM NAVIGASI (Tanpa Settings)
const navItems = [
    { nameKey: 'dashboard', path: '/', icon: Home, color: 'text-blue-600' },
    { nameKey: 'myClass', path: '/courses', icon: BookOpen, color: 'text-green-600' },
    { nameKey: 'aiAnalysis', path: '/analytics', icon: BarChart3, color: 'text-purple-600' },
    { nameKey: 'target', path: '/target', icon: Target, color: 'text-orange-600' },
];

const Navbar = () => { 
    // Ambil t (translate) dari AppContext
    const { t } = useApp(); 

    return (
        // Sidebar Container
        <aside className="w-64 bg-white dark:bg-gray-900 fixed h-full border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
            
            {/* Header Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><BrainCircuit size={24} /></div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">AI Learning</span>
                </div>
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-1 p-3 space-y-1 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 
                            ${isActive
                                // Active State
                                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold'
                                // Inactive State
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`
                        }
                    >
                        {/* Render Icon */}
                        <item.icon size={20} className={item.color} /> 
                        <span className="text-sm">{t(item.nameKey)}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer Sidebar (Dikosongkan karena Logout/Settings ada di Avatar) */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 hidden">
                {/* Bagian ini sengaja dikosongkan/disembunyikan */}
            </div>
            
        </aside>
    );
};

export default Navbar;