import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Navbar from './Navbar'; // Panggil Navbar yang sudah kita edit tadi

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      
      {/* 1. SIDEBAR DESKTOP (Hanya muncul di layar MD ke atas) */}
      <div className="hidden md:block w-64 fixed inset-y-0 z-30">
        <Navbar />
      </div>

      {/* 2. SIDEBAR MOBILE (Muncul saat tombol menu diklik) */}
      {/* Overlay Gelap */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Drawer Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative h-full">
            {/* Tombol Close (X) */}
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <X size={20} />
            </button>
            {/* Isi Sidebar */}
            <Navbar />
        </div>
      </div>

      {/* 3. KONTEN UTAMA */}
      {/* md:ml-64 memberikan margin kiri di Desktop agar tidak tertutup sidebar */}
      <main className="flex-1 w-full md:ml-64 transition-all duration-300">
        
        {/* HEADER MOBILE (Hanya muncul di HP) */}
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-20 flex justify-between items-center">
          <span className="font-bold text-lg text-gray-800 dark:text-white">Adaptive Learning Insight</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu size={24} />
          </button>
        </div>

        {/* ISI HALAMAN (Dashboard, dll) */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;