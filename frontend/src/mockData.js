// --- 1. DATA PENGGUNA ---
export const mockUser = {
  id: 1,
  display_name: "Siswa Teladan",
  email: "siswa@dicoding.com",
  image_path: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  user_role: "student"
};

// --- 2. DATA TRACKING (Opsional: Disimpan untuk referensi masa depan) ---
export const mockTrackings = [
  { id: 1, journey_id: 101, completed_at: "2023-11-20T10:00:00Z" },
  // ... data lainnya
];

// --- 3. HASIL UJIAN (Untuk Statistik 'Rata-rata Ujian') ---
export const mockExamResults = [
  { id: 1, score: 80, is_passed: true },
  { id: 2, score: 60, is_passed: true },
  { id: 3, score: 90, is_passed: true },
];

// --- 4. PENYELESAIAN (Untuk Statistik 'Total Jam Belajar') ---
export const mockCompletions = {
  study_duration: 1540,
};

// --- 5. DAFTAR KELAS (Untuk Halaman 'Kelas Saya') ---
export const mockJourneys = [
  {
    id: 101,
    name: "Menjadi React Developer Expert",
    summary: "Pelajari teknik advanced React, Redux, dan optimasi performa.",
    difficulty: "Advanced",
    total_modules: 4, 
    image_path: "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg", 
    progress: 65, 
    status: "active"
  },
  {
    id: 102,
    name: "Belajar Dasar Machine Learning",
    summary: "Pahami konsep dasar ML, Supervised Learning, dan Neural Network.",
    difficulty: "Beginner",
    total_modules: 2,
    image_path: "https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-1805.jpg",
    progress: 10,
    status: "active"
  },
  {
    id: 103,
    name: "Membangun Back-End dengan Node.js",
    summary: "Buat RESTful API yang scalable menggunakan Hapi dan PostgreSQL.",
    difficulty: "Intermediate",
    total_modules: 0,
    image_path: "https://img.freepik.com/free-vector/server-room-concept-illustration_114360-4238.jpg",
    progress: 0,
    status: "inactive"
  }
];

// --- 6. TUTORIAL (Untuk Detail Kelas - jika ada) ---
export const mockTutorials = [
  { id: 1, journey_id: 101, title: "Pengenalan React & Virtual DOM", type: "video", duration: "10:20" },
  { id: 2, journey_id: 101, title: "Konsep Component & Props", type: "video", duration: "15:00" },
];

// --- 7. SKILL MAP (Untuk Halaman 'Analisis AI') ---
export const mockSkills = [
  { subject: 'React Core', A: 120, fullMark: 150 },
  { subject: 'State Management', A: 98, fullMark: 150 },
  { subject: 'API Integration', A: 86, fullMark: 150 },
  { subject: 'Testing', A: 65, fullMark: 150 },
  { subject: 'UI/UX', A: 85, fullMark: 150 },
  { subject: 'Deployment', A: 90, fullMark: 150 },
];

// DATA CHART DASHBOARD (STRUKTUR BARU UNTUK FILTER BULAN)
// Kita kelompokkan data per bulan (Jun, Nov, Des, dst) agar Dashboard bisa memilih.
export const mockChartData = {
    // Data Bulan JUNI (Skenario: User Rajin)
    Jun: {
        daily: [
            { label: 'Sen', value: 4 }, { label: 'Sel', value: 5 }, { label: 'Rab', value: 0 },
            { label: 'Kam', value: 6 }, { label: 'Jum', value: 3 }, { label: 'Sab', value: 8 }, { label: 'Min', value: 2 }
        ],
        weekly: [
            { label: 'Mgg 1', value: 20 }, { label: 'Mgg 2', value: 25 }, { label: 'Mgg 3', value: 18 }, { label: 'Mgg 4', value: 28 }
        ]
    },
    
    // Data Bulan NOVEMBER (Skenario: User Santai/Sedikit Aktifitas)
    Nov: {
        daily: [
            { label: 'Sen', value: 2 }, { label: 'Sel', value: 2 }, { label: 'Rab', value: 3 },
            { label: 'Kam', value: 1 }, { label: 'Jum', value: 0 }, { label: 'Sab', value: 5 }, { label: 'Min', value: 4 }
        ],
        weekly: [
            { label: 'Mgg 1', value: 5 }, { label: 'Mgg 2', value: 8 }, { label: 'Mgg 3', value: 12 }, { label: 'Mgg 4', value: 7 }
        ]
    },

    // Data Bulan DESEMBER (Skenario: User Liburan/Kosong)
    Des: {
        daily: [
            { label: 'Sen', value: 1 }, { label: 'Sel', value: 0 }, { label: 'Rab', value: 0 },
            { label: 'Kam', value: 2 }, { label: 'Jum', value: 0 }, { label: 'Sab', value: 0 }, { label: 'Min', value: 0 }
        ],
        weekly: [
            { label: 'Mgg 1', value: 3 }, { label: 'Mgg 2', value: 2 }, { label: 'Mgg 3', value: 0 }, { label: 'Mgg 4', value: 0 }
        ]
    }
};

// DATA KHUSUS UNTUK TOMBOL "TAHUN INI" (Ringkasan Jan-Des)
export const mockYearlyOverview = [
    { label: 'Jan', value: 15 }, 
    { label: 'Feb', value: 20 }, 
    { label: 'Mar', value: 18 },
    { label: 'Apr', value: 25 }, 
    { label: 'Mei', value: 30 }, 
    { label: 'Jun', value: 91 },
    { label: 'Jul', value: 10 }, 
    { label: 'Agu', value: 12 }, 
    { label: 'Sep', value: 15 },
    { label: 'Okt', value: 20 }, 
    { label: 'Nov', value: 32 }, 
    { label: 'Des', value: 5 }
];

// --- EXPORT DEFAULT UNTUK KOMPATIBILITAS ---
export const mockDailyActivity = mockChartData.Jun.daily;
export const mockWeeklyActivity = mockChartData.Jun.weekly;
export const mockMonthlyActivity = mockYearlyOverview;