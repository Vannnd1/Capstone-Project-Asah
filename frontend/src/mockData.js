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
  { id: 1, journey_id: 101, completed_at: "2026-11-20T10:00:00Z" },
  { id: 2, journey_id: 104, completed_at: "2026-11-18T14:30:00Z" },
];

// --- 3. HASIL UJIAN (Untuk Statistik 'Rata-rata Ujian') ---
export const mockExamResults = [
  { id: 1, score: 85, is_passed: true },
  { id: 2, score: 92, is_passed: true },
  { id: 3, score: 88, is_passed: true },
];

// --- 4. PENYELESAIAN (Untuk Statistik 'Total Jam Belajar') ---
export const mockCompletions = {
  study_duration: 1860,
};

// --- 5. DAFTAR KELAS (Untuk Halaman 'Kelas Saya') ---
export const mockJourneys = [
  {
    id: 101,
    name: "Menjadi React Developer Expert",
    summary: "Pelajari teknik advanced React, State Management, Custom Hooks, dan optimasi performa render.",
    difficulty: "Advanced",
    category: "Frontend",
    total_modules: 4, 
    image_path: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80", 
    progress: 50, 
    status: "active"
  },
  {
    id: 102,
    name: "Belajar Dasar Machine Learning & AI",
    summary: "Pahami konsep kecerdasan buatan, Supervised Learning, dan pelatihan model prediksi dengan Scikit-Learn.",
    difficulty: "Beginner",
    category: "AI & Data",
    total_modules: 3,
    image_path: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80",
    progress: 33,
    status: "active"
  },
  {
    id: 103,
    name: "Membangun Back-End RESTful API Modern",
    summary: "Buat arsitektur RESTful API yang scalable, aman, terhubung ke database relasional, dan siap produksi.",
    difficulty: "Intermediate",
    category: "Backend",
    total_modules: 4,
    image_path: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=80",
    progress: 0,
    status: "not_started"
  },
  {
    id: 104,
    name: "Cloud Practitioner Essentials (AWS)",
    summary: "Kuasai arsitektur komputasi awan, storage S3, EC2 instances, dan standar security compliance global.",
    difficulty: "Beginner",
    category: "Cloud & DevOps",
    total_modules: 3,
    image_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    progress: 100,
    status: "completed"
  },
  {
    id: 105,
    name: "Pengembangan Web Modern dengan Next.js",
    summary: "Eksplorasi App Router, Server Components, Server Actions, dan optimasi Core Web Vitals.",
    difficulty: "Advanced",
    category: "Frontend",
    total_modules: 4,
    image_path: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    progress: 25,
    status: "active"
  },
  {
    id: 106,
    name: "UI/UX Design Fundamental untuk Web & Mobile",
    summary: "Kuasai prinsip desain antarmuka, teori warna, typography, wireframing, dan interactive prototyping di Figma.",
    difficulty: "Beginner",
    category: "Design",
    total_modules: 3,
    image_path: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80",
    progress: 66,
    status: "active"
  }
];

// --- 6. TUTORIAL (Untuk Detail Kelas & Materi Modul) ---
export const mockTutorials = [
  // Journey 101 - React Developer Expert
  { 
    id: 1, 
    journey_id: 101, 
    title: "Pengenalan React & Virtual DOM Reconciliation", 
    type: "video", 
    duration: "12:45",
    description: "Memahami bagaimana React merender UI secara efisien melalui Virtual DOM Reconciliation.",
    content: "Di modul ini kita membedah konsep reconciler, diffing algorithm O(n), dan bagaimana Fiber tree mengelola prioritas render secara asinkron tanpa memblokir thread browser utama."
  },
  { 
    id: 2, 
    journey_id: 101, 
    title: "State Management Modern & Custom Hooks", 
    type: "text", 
    duration: "18:00",
    description: "Pola arsitektur komponen React, unidirectional data flow, dan ekstraksi business logic ke custom hooks.",
    content: "Membahas pemisahan presentational vs container components, best practice membuat hook reuseable, dan pencegahan prop drilling dengan context selector."
  },
  { 
    id: 3, 
    journey_id: 101, 
    title: "Optimasi Performa dengan useMemo & Profiler", 
    type: "video", 
    duration: "15:20",
    description: "Mencegah re-render yang tidak perlu menggunakan teknik profiling dan memoization presisi.",
    content: "Praktik menggunakan React DevTools Profiler untuk mendeteksi bottleneck komponen, mengukur render duration, dan menerapkan React.memo dengan tepat sasaran."
  },
  { 
    id: 4, 
    journey_id: 101, 
    title: "Quiz: Arsitektur & Kinerja React Tingkat Lanjut", 
    type: "quiz", 
    duration: "10:00",
    description: "Uji pemahamanmu seputar lifecycle, memory leaks, dan state management modern.",
    content: "Kuis evaluasi interaktif yang menguji pengetahuan troubleshooting re-render loop, useEffect cleanup, dan asynchronous state batching."
  },

  // Journey 102 - Machine Learning
  { 
    id: 5, 
    journey_id: 102, 
    title: "Pengenalan Ekosistem Kecerdasan Buatan & ML", 
    type: "video", 
    duration: "14:15",
    description: "Konsep dasar machine learning, jenis-jenis model, dan siklus hidup pengembangan ML.",
    content: "Memahami perbedaan AI, ML, dan Deep Learning serta alur data pipeline: data collection, preprocessing, exploratory data analysis, modeling, dan evaluasi performa."
  },
  { 
    id: 6, 
    journey_id: 102, 
    title: "Supervised Learning: Regresi & Klasifikasi", 
    type: "text", 
    duration: "20:00",
    description: "Membedah algoritma Linear Regression, Logistic Regression, dan Decision Trees.",
    content: "Pembahasan mendalam cost function, gradient descent optimization, serta metrik evaluasi Accuracy, Precision, Recall, Confusion Matrix, dan F1-Score."
  },
  { 
    id: 7, 
    journey_id: 102, 
    title: "Praktik Modeling dengan Python & Scikit-Learn", 
    type: "quiz", 
    duration: "25:00",
    description: "Latihan praktis melatih model klasifikasi data tabular menggunakan Python.",
    content: "Implementasi split train-test data, feature scaling dengan StandardScaler, cross-validation, serta hyperparameter tuning untuk memaksimalkan akurasi model."
  },

  // Journey 103 - Back-End RESTful API
  { 
    id: 8, 
    journey_id: 103, 
    title: "Arsitektur RESTful API & Async I/O", 
    type: "video", 
    duration: "16:30",
    description: "Pondasi asynchronous I/O, Event Loop concurrency, dan standar arsitektur REST API.",
    content: "Memahami prinsip statelessness, resource routing bersarang, standard HTTP status codes, dan format response seragam untuk kemudahan integrasi klien."
  },
  { 
    id: 9, 
    journey_id: 103, 
    title: "Database Relasional & Query Optimization", 
    type: "text", 
    duration: "22:00",
    description: "Perancangan skema database, indexing, foreign keys, dan transaksi ACID.",
    content: "Panduan menulis query optimal, connection pooling, ORM data mapping, dan pencegahan SQL Injection dengan parameterized queries."
  },
  { 
    id: 10, 
    journey_id: 103, 
    title: "Autentikasi JWT, Password Hashing, & Security", 
    type: "text", 
    duration: "19:40",
    description: "Keamanan web: bcrypt salting, JWT token sign/verify, dan middleware proteksi endpoint.",
    content: "Membangun sistem login enterprise dengan Bearer token authentication, role-based access control (RBAC), dan mitigasi celah keamanan web umum."
  },
  { 
    id: 11, 
    journey_id: 103, 
    title: "Submission Tugas: REST API Production-Ready", 
    type: "quiz", 
    duration: "30:00",
    description: "Implementasikan endpoint CRUD lengkap dengan unit test dan dokumentasi OpenAPI.",
    content: "Validasi fungsionalitas API, integrasi automated tests, dan kriteria kelulusan evaluasi arsitektur backend."
  },

  // Journey 104 - Cloud Practitioner (AWS)
  { 
    id: 12, 
    journey_id: 104, 
    title: "Pengenalan Komputasi Awan & Global AWS Infrastructure", 
    type: "video", 
    duration: "15:00",
    description: "Konsep Regions, Availability Zones, Edge Locations, dan Shared Responsibility Model.",
    content: "Prinsip dasar cloud economics, perbandingan On-Premise vs Cloud, skalabilitas elastis, dan tingkat ketersediaan tinggi (High Availability)."
  },
  { 
    id: 13, 
    journey_id: 104, 
    title: "Layanan Komputasi & Storage: EC2, S3, & RDS", 
    type: "text", 
    duration: "24:00",
    description: "Praktek konfigurasi virtual server instances, scalable object storage, dan database cloud terkelola.",
    content: "Konfigurasi Security Groups, subnet virtual VPC, bucket policy keamanan S3, serta automated snapshot backup RDS."
  },
  { 
    id: 14, 
    journey_id: 104, 
    title: "Evaluasi Akhir & Simulasi Sertifikasi AWS", 
    type: "quiz", 
    duration: "25:00",
    description: "Simulasi ujian 15 soal seputar arsitektur cloud, biaya efisien, dan security compliance.",
    content: "Menguji kesiapan sertifikasi resmi AWS Certified Cloud Practitioner dengan studi kasus industri nyata."
  },

  // Journey 105 - Next.js
  { 
    id: 15, 
    journey_id: 105, 
    title: "Next.js App Router & Server Components", 
    type: "video", 
    duration: "18:20",
    description: "Perbedaan Server Components vs Client Components di ekosistem Next.js modern.",
    content: "Pemanfaatan layout bersarang, streaming UI dengan React Suspense, dan pemuatan data langsung di server tanpa client waterfalls."
  },
  { 
    id: 16, 
    journey_id: 105, 
    title: "Server Actions & Mutasi Data Real-Time", 
    type: "text", 
    duration: "20:00",
    description: "Menghilangkan kebutuhan endpoint API manual dengan Server Actions native.",
    content: "Penanganan form submission aman, revalidasi cache on-demand dengan revalidatePath, dan implementasi optimistic UI updates."
  },
  { 
    id: 17, 
    journey_id: 105, 
    title: "Optimasi SEO, Metadata Dinamis, & Web Vitals", 
    type: "video", 
    duration: "14:50",
    description: "Teknik mencapai skor performa sempurna pada Google Core Web Vitals.",
    content: "Optimasi font self-hosted, rendering gambar otomatis next/image, dynamic Open Graph social cards, dan sitemap generation."
  },
  { 
    id: 18, 
    journey_id: 105, 
    title: "Mini Project: Deploy Full-Stack E-Learning Portal", 
    type: "quiz", 
    duration: "35:00",
    description: "Deploy aplikasi Next.js ke edge runtime dengan serverless database.",
    content: "Checklist persiapan production: caching headers, edge middleware, secure environment variables, dan monitoring performa."
  },

  // Journey 106 - UI/UX Design
  { 
    id: 19, 
    journey_id: 106, 
    title: "Prinsip Desain Visual, Typography, & Color Theory", 
    type: "video", 
    duration: "13:30",
    description: "Membangun rasa estetika, sistem grid 8pt, tipografi responsif, dan standar kontras WCAG.",
    content: "Pedoman mendesain UI yang ramah mata, konsisten, mudah dipindai, dan mendukung aksesibilitas untuk semua kalangan pengguna."
  },
  { 
    id: 20, 
    journey_id: 106, 
    title: "Membangun Design System & Komponen di Figma", 
    type: "text", 
    duration: "25:00",
    description: "Pemanfaatan Auto Layout, Component Variants, dan Design Tokens di Figma.",
    content: "Panduan membuat library komponen yang modular, atomic design principles, dan kemudahan serah terima ke tim engineer frontend."
  },
  { 
    id: 21, 
    journey_id: 106, 
    title: "Usability Testing & Evaluasi Alur Interaksi", 
    type: "quiz", 
    duration: "20:00",
    description: "Validasi prototipe interaktif dengan user testing dan penyempurnaan alur tugas pengguna.",
    content: "Penerapan metode System Usability Scale (SUS), observasi task completion rate, dan analisis feedback kualitatif pengguna."
  }
];

// --- 7. SKILL MAP (Untuk Halaman 'Analisis AI') ---
export const mockSkills = [
  { subject: 'React Core', A: 120, fullMark: 150 },
  { subject: 'State Management', A: 98, fullMark: 150 },
  { subject: 'API Integration', A: 110, fullMark: 150 },
  { subject: 'Cloud & DevOps', A: 135, fullMark: 150 },
  { subject: 'UI/UX Design', A: 115, fullMark: 150 },
  { subject: 'Machine Learning', A: 75, fullMark: 150 },
];

// DATA CHART DASHBOARD (STRUKTUR BARU UNTUK FILTER BULAN)
export const mockChartData = {
    Jun: {
        daily: [
            { label: 'Sen', value: 4 }, { label: 'Sel', value: 5 }, { label: 'Rab', value: 0 },
            { label: 'Kam', value: 6 }, { label: 'Jum', value: 3 }, { label: 'Sab', value: 8 }, { label: 'Min', value: 2 }
        ],
        weekly: [
            { label: 'Mgg 1', value: 20 }, { label: 'Mgg 2', value: 25 }, { label: 'Mgg 3', value: 18 }, { label: 'Mgg 4', value: 28 }
        ]
    },
    Nov: {
        daily: [
            { label: 'Sen', value: 2 }, { label: 'Sel', value: 3 }, { label: 'Rab', value: 4 },
            { label: 'Kam', value: 2 }, { label: 'Jum', value: 3 }, { label: 'Sab', value: 5 }, { label: 'Min', value: 4 }
        ],
        weekly: [
            { label: 'Mgg 1', value: 8 }, { label: 'Mgg 2', value: 12 }, { label: 'Mgg 3', value: 15 }, { label: 'Mgg 4', value: 11 }
        ]
    },
    Des: {
        daily: [
            { label: 'Sen', value: 1 }, { label: 'Sel', value: 0 }, { label: 'Rab', value: 2 },
            { label: 'Kam', value: 2 }, { label: 'Jum', value: 0 }, { label: 'Sab', value: 1 }, { label: 'Min', value: 0 }
        ],
        weekly: [
            { label: 'Mgg 1', value: 3 }, { label: 'Mgg 2', value: 4 }, { label: 'Mgg 3', value: 2 }, { label: 'Mgg 4', value: 1 }
        ]
    }
};

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
    { label: 'Nov', value: 35 }, 
    { label: 'Des', value: 8 }
];

export const mockDailyActivity = mockChartData.Nov.daily;
export const mockWeeklyActivity = mockChartData.Nov.weekly;
export const mockMonthlyActivity = mockYearlyOverview;
