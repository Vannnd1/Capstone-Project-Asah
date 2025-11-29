import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, FileText, HelpCircle, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { mockJourneys, mockTutorials } from '../mockData';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = parseInt(id);

  // Cari data course & materi berdasarkan ID
  const course = mockJourneys.find(c => c.id === courseId);
  const modules = mockTutorials.filter(m => m.journey_id === courseId);
  
  const [activeModule, setActiveModule] = useState(modules[0]);

  if (!course) return <div className="p-10 text-center">Kelas tidak ditemukan</div>;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header Kelas */}
      <header className="bg-gray-900 text-white p-4 flex items-center gap-4 shadow-md z-20">
        <button onClick={() => navigate('/courses')} className="p-2 hover:bg-gray-800 rounded-full transition">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="font-bold text-lg">{course.name}</h1>
            <p className="text-gray-400 text-xs flex items-center gap-2">
                {activeModule ? activeModule.title : 'Pilih materi'}
            </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Area Konten Utama */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto flex flex-col items-center justify-center">
             {activeModule ? (
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                        {activeModule.type === 'video' && <PlayCircle size={40} />}
                        {activeModule.type === 'text' && <FileText size={40} />}
                        {activeModule.type === 'quiz' && <HelpCircle size={40} />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeModule.title}</h2>
                    <p className="text-gray-500 mb-8">Simulasi Konten Belajar ({activeModule.type})</p>
                    <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                        Tandai Selesai
                    </button>
                </div>
             ) : (
                <p className="text-gray-500">Pilih modul di sebelah kanan untuk mulai belajar.</p>
             )}
        </main>

        {/* Sidebar Daftar Modul */}
        <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto z-10">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800">Daftar Materi</h3>
                <p className="text-xs text-gray-500 mt-1">{modules.length} Modul tersedia</p>
            </div>
            <div className="divide-y divide-gray-100">
                {modules.map((modul, index) => (
                    <button 
                        key={modul.id} 
                        onClick={() => setActiveModule(modul)}
                        className={`w-full p-4 text-left flex gap-3 hover:bg-gray-50 transition-colors ${activeModule?.id === modul.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                    >
                        <div className="mt-1 text-gray-400">
                            {index === 0 ? <CheckCircle size={16} className="text-green-500" /> : <Lock size={16} />}
                        </div>
                        <div>
                            <h4 className={`text-sm font-medium ${activeModule?.id === modul.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                {modul.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 capitalize">
                                <span>{modul.type}</span> • <span>{modul.duration}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;