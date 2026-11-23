// --- 1. DATA PENGGUNA ---
export const mockUser = {
  id: 1,
  display_name: "Siswa Teladan",
  email: "siswa@dicoding.com",
  image_path: "/avatars/characters/char-felix.svg",
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

// --- 5. DAFTAR KELAS BILINGUAL (Untuk Halaman 'Kelas Saya') ---
export const mockJourneys = [
  {
    id: 101,
    name: "Menjadi React Developer Expert",
    name_en: "Becoming a React Developer Expert",
    summary: "Pelajari teknik advanced React, State Management, Custom Hooks, dan optimasi performa render.",
    summary_en: "Master advanced React techniques, State Management, Custom Hooks, and render performance optimization.",
    difficulty: "Advanced",
    difficulty_id: "Mahir",
    difficulty_en: "Advanced",
    category: "Frontend",
    total_modules: 4, 
    image_path: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80", 
    progress: 50, 
    status: "active"
  },
  {
    id: 102,
    name: "Belajar Dasar Machine Learning & AI",
    name_en: "Fundamentals of Machine Learning & AI",
    summary: "Pahami konsep kecerdasan buatan, Supervised Learning, dan pelatihan model prediksi dengan Scikit-Learn.",
    summary_en: "Understand artificial intelligence concepts, Supervised Learning, and training predictive models with Scikit-Learn.",
    difficulty: "Beginner",
    difficulty_id: "Pemula",
    difficulty_en: "Beginner",
    category: "AI & Data",
    total_modules: 3,
    image_path: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80",
    progress: 33,
    status: "active"
  },
  {
    id: 103,
    name: "Membangun Back-End RESTful API Modern",
    name_en: "Building Modern Back-End RESTful APIs",
    summary: "Buat arsitektur RESTful API yang scalable, aman, terhubung ke database relasional, dan siap produksi.",
    summary_en: "Construct scalable, secure RESTful API architectures connected to relational databases, production-ready.",
    difficulty: "Intermediate",
    difficulty_id: "Menengah",
    difficulty_en: "Intermediate",
    category: "Backend",
    total_modules: 4,
    image_path: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=80",
    progress: 0,
    status: "not_started"
  },
  {
    id: 104,
    name: "Cloud Practitioner Essentials (AWS)",
    name_en: "Cloud Practitioner Essentials (AWS)",
    summary: "Kuasai arsitektur komputasi awan, storage S3, EC2 instances, dan standar security compliance global.",
    summary_en: "Master cloud computing architecture, S3 storage, EC2 instances, and global security compliance standards.",
    difficulty: "Beginner",
    difficulty_id: "Pemula",
    difficulty_en: "Beginner",
    category: "Cloud & DevOps",
    total_modules: 3,
    image_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    progress: 100,
    status: "completed"
  },
  {
    id: 105,
    name: "Pengembangan Web Modern dengan Next.js",
    name_en: "Modern Web Development with Next.js",
    summary: "Eksplorasi App Router, Server Components, Server Actions, dan optimasi Core Web Vitals.",
    summary_en: "Explore App Router, Server Components, Server Actions, and Core Web Vitals optimization.",
    difficulty: "Advanced",
    difficulty_id: "Mahir",
    difficulty_en: "Advanced",
    category: "Frontend",
    total_modules: 4,
    image_path: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    progress: 25,
    status: "active"
  },
  {
    id: 106,
    name: "UI/UX Design Fundamental untuk Web & Mobile",
    name_en: "UI/UX Design Fundamentals for Web & Mobile",
    summary: "Kuasai prinsip desain antarmuka, teori warna, typography, wireframing, dan interactive prototyping di Figma.",
    summary_en: "Master user interface principles, color theory, typography, wireframing, and interactive prototyping in Figma.",
    difficulty: "Beginner",
    difficulty_id: "Pemula",
    difficulty_en: "Beginner",
    category: "Design",
    total_modules: 3,
    image_path: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80",
    progress: 66,
    status: "active"
  }
];

// --- 6. TUTORIAL BILINGUAL (Untuk Detail Kelas & Materi Modul) ---
export const mockTutorials = [
  // Journey 101 - React Developer Expert
  { 
    id: 1, 
    journey_id: 101, 
    title: "Pengenalan React & Virtual DOM Reconciliation", 
    title_en: "Introduction to React & Virtual DOM Reconciliation",
    type: "video", 
    duration: "12:45",
    description: "Memahami bagaimana React merender UI secara efisien melalui Virtual DOM Reconciliation.",
    description_en: "Understand how React efficiently renders user interfaces using Virtual DOM Reconciliation.",
    content: "Di modul ini kita membedah konsep reconciler, diffing algorithm O(n), dan bagaimana Fiber tree mengelola prioritas render secara asinkron tanpa memblokir thread browser utama.",
    content_en: "In this module we break down the reconciler concept, the O(n) diffing algorithm, and how the Fiber tree schedules render priorities asynchronously without blocking the main browser thread."
  },
  { 
    id: 2, 
    journey_id: 101, 
    title: "State Management Modern & Custom Hooks", 
    title_en: "Modern State Management & Custom Hooks",
    type: "text", 
    duration: "18:00",
    description: "Pola arsitektur komponen React, unidirectional data flow, dan ekstraksi business logic ke custom hooks.",
    description_en: "React component architecture patterns, unidirectional data flow, and extracting business logic into custom hooks.",
    content: "Membahas pemisahan presentational vs container components, best practice membuat hook reuseable, dan pencegahan prop drilling dengan context selector.",
    content_en: "Discussing the separation of presentational vs container components, best practices for reusable hooks, and mitigating prop drilling with context selectors."
  },
  { 
    id: 3, 
    journey_id: 101, 
    title: "Optimasi Performa dengan useMemo & Profiler", 
    title_en: "Performance Optimization with useMemo & Profiler",
    type: "video", 
    duration: "15:20",
    description: "Mencegah re-render yang tidak perlu menggunakan teknik profiling dan memoization presisi.",
    description_en: "Preventing redundant re-renders utilizing profiling techniques and precise memoization.",
    content: "Praktik menggunakan React DevTools Profiler untuk mendeteksi bottleneck komponen, mengukur render duration, dan menerapkan React.memo dengan tepat sasaran.",
    content_en: "Hands-on practice using React DevTools Profiler to pinpoint component bottlenecks, measure render durations, and apply React.memo accurately."
  },
  { 
    id: 4, 
    journey_id: 101, 
    title: "Quiz: Arsitektur & Kinerja React Tingkat Lanjut", 
    title_en: "Quiz: Advanced React Architecture & Performance",
    type: "quiz", 
    duration: "10:00",
    description: "Uji pemahamanmu seputar lifecycle, memory leaks, dan state management modern.",
    description_en: "Test your understanding of lifecycles, memory leaks, and modern state management.",
    content: "Kuis evaluasi interaktif yang menguji pengetahuan troubleshooting re-render loop, useEffect cleanup, dan asynchronous state batching.",
    content_en: "Interactive evaluation quiz assessing your troubleshooting skills for re-render loops, useEffect cleanups, and asynchronous state batching."
  },

  // Journey 102 - Machine Learning
  { 
    id: 5, 
    journey_id: 102, 
    title: "Pengenalan Ekosistem Kecerdasan Buatan & ML", 
    title_en: "Introduction to Artificial Intelligence & ML Ecosystem",
    type: "video", 
    duration: "14:15",
    description: "Konsep dasar machine learning, jenis-jenis model, dan siklus hidup pengembangan ML.",
    description_en: "Core concepts of machine learning, model archetypes, and the ML development lifecycle.",
    content: "Memahami perbedaan AI, ML, dan Deep Learning serta alur data pipeline: data collection, preprocessing, exploratory data analysis, modeling, dan evaluasi performa.",
    content_en: "Distinguish between AI, ML, and Deep Learning as well as the data pipeline flow: collection, preprocessing, exploratory data analysis, modeling, and performance evaluation."
  },
  { 
    id: 6, 
    journey_id: 102, 
    title: "Supervised Learning: Regresi & Klasifikasi", 
    title_en: "Supervised Learning: Regression & Classification",
    type: "text", 
    duration: "20:00",
    description: "Membedah algoritma Linear Regression, Logistic Regression, dan Decision Trees.",
    description_en: "Dissecting Linear Regression, Logistic Regression, and Decision Tree algorithms.",
    content: "Pembahasan mendalam cost function, gradient descent optimization, serta metrik evaluasi Accuracy, Precision, Recall, Confusion Matrix, dan F1-Score.",
    content_en: "In-depth breakdown of cost functions, gradient descent optimization, and evaluation metrics: Accuracy, Precision, Recall, Confusion Matrix, and F1-Score."
  },
  { 
    id: 7, 
    journey_id: 102, 
    title: "Praktik Modeling dengan Python & Scikit-Learn", 
    title_en: "Practical Modeling with Python & Scikit-Learn",
    type: "quiz", 
    duration: "25:00",
    description: "Latihan praktis melatih model klasifikasi data tabular menggunakan Python.",
    description_en: "Hands-on exercise training tabular classification models using Python.",
    content: "Implementasi split train-test data, feature scaling dengan StandardScaler, cross-validation, serta hyperparameter tuning untuk memaksimalkan akurasi model.",
    content_en: "Implementing train-test splits, feature scaling with StandardScaler, cross-validation, and hyperparameter tuning to optimize model accuracy."
  },

  // Journey 103 - Back-End RESTful API
  { 
    id: 8, 
    journey_id: 103, 
    title: "Arsitektur RESTful API & Async I/O", 
    title_en: "RESTful API Architecture & Async I/O",
    type: "video", 
    duration: "16:30",
    description: "Pondasi asynchronous I/O, Event Loop concurrency, dan standar arsitektur REST API.",
    description_en: "Foundations of asynchronous I/O, Event Loop concurrency, and REST API architectural standards.",
    content: "Memahami prinsip statelessness, resource routing bersarang, standard HTTP status codes, dan format response seragam untuk kemudahan integrasi klien.",
    content_en: "Mastering statelessness principles, nested resource routing, standard HTTP status codes, and uniform response schemas for seamless client integration."
  },
  { 
    id: 9, 
    journey_id: 103, 
    title: "Database Relasional & Query Optimization", 
    title_en: "Relational Databases & Query Optimization",
    type: "text", 
    duration: "22:00",
    description: "Perancangan skema database, indexing, foreign keys, dan transaksi ACID.",
    description_en: "Database schema design, indexing strategies, foreign keys, and ACID transactions.",
    content: "Panduan menulis query optimal, connection pooling, ORM data mapping, dan pencegahan SQL Injection dengan parameterized queries.",
    content_en: "Guidelines for writing performant queries, connection pooling, ORM mapping, and mitigating SQL Injection via parameterized queries."
  },
  { 
    id: 10, 
    journey_id: 103, 
    title: "Autentikasi JWT, Password Hashing, & Security", 
    title_en: "JWT Authentication, Password Hashing, & Security",
    type: "text", 
    duration: "19:40",
    description: "Keamanan web: bcrypt salting, JWT token sign/verify, dan middleware proteksi endpoint.",
    description_en: "Web security essentials: bcrypt salting, JWT token signing/verification, and route protection middleware.",
    content: "Membangun sistem login enterprise dengan Bearer token authentication, role-based access control (RBAC), dan mitigasi celah keamanan web umum.",
    content_en: "Building enterprise login systems with Bearer token authentication, role-based access control (RBAC), and mitigating common web vulnerabilities."
  },
  { 
    id: 11, 
    journey_id: 103, 
    title: "Submission Tugas: REST API Production-Ready", 
    title_en: "Task Submission: Production-Ready REST API",
    type: "quiz", 
    duration: "30:00",
    description: "Implementasikan endpoint CRUD lengkap dengan unit test dan dokumentasi OpenAPI.",
    description_en: "Implement full CRUD endpoints accompanied by unit test suites and OpenAPI specifications.",
    content: "Validasi fungsionalitas API, integrasi automated tests, dan kriteria kelulusan evaluasi arsitektur backend.",
    content_en: "Validating API endpoints, continuous test automation, and backend architectural graduation criteria."
  },

  // Journey 104 - Cloud Practitioner (AWS)
  { 
    id: 12, 
    journey_id: 104, 
    title: "Pengenalan Komputasi Awan & Global AWS Infrastructure", 
    title_en: "Introduction to Cloud Computing & AWS Global Infrastructure",
    type: "video", 
    duration: "15:00",
    description: "Konsep Regions, Availability Zones, Edge Locations, dan Shared Responsibility Model.",
    description_en: "Core concepts of Regions, Availability Zones, Edge Locations, and the Shared Responsibility Model.",
    content: "Prinsip dasar cloud economics, perbandingan On-Premise vs Cloud, skalabilitas elastis, dan tingkat ketersediaan tinggi (High Availability).",
    content_en: "Core principles of cloud economics, On-Premise vs Cloud trade-offs, elastic scalability, and High Availability designs."
  },
  { 
    id: 13, 
    journey_id: 104, 
    title: "Layanan Komputasi & Storage: EC2, S3, & RDS", 
    title_en: "Compute & Storage Services: EC2, S3, & RDS",
    type: "text", 
    duration: "24:00",
    description: "Praktek konfigurasi virtual server instances, scalable object storage, dan database cloud terkelola.",
    description_en: "Hands-on configuration of virtual server instances, scalable object storage, and managed cloud databases.",
    content: "Konfigurasi Security Groups, subnet virtual VPC, bucket policy keamanan S3, serta automated snapshot backup RDS.",
    content_en: "Configuring Security Groups, VPC virtual subnets, S3 security policies, and automated RDS snapshot backups."
  },
  { 
    id: 14, 
    journey_id: 104, 
    title: "Evaluasi Akhir & Simulasi Sertifikasi AWS", 
    title_en: "Final Evaluation & AWS Certification Simulation",
    type: "quiz", 
    duration: "25:00",
    description: "Simulasi ujian 15 soal seputar arsitektur cloud, biaya efisien, dan security compliance.",
    description_en: "15-question simulation exam covering cloud architecture, cost optimization, and security compliance.",
    content: "Menguji kesiapan sertifikasi resmi AWS Certified Cloud Practitioner dengan studi kasus industri nyata.",
    content_en: "Testing readiness for the official AWS Certified Cloud Practitioner exam using real-world enterprise case studies."
  },

  // Journey 105 - Next.js
  { 
    id: 15, 
    journey_id: 105, 
    title: "Next.js App Router & Server Components", 
    title_en: "Next.js App Router & Server Components",
    type: "video", 
    duration: "18:20",
    description: "Perbedaan Server Components vs Client Components di ekosistem Next.js modern.",
    description_en: "Key distinctions between Server Components and Client Components in modern Next.js.",
    content: "Pemanfaatan layout bersarang, streaming UI dengan React Suspense, dan pemuatan data langsung di server tanpa client waterfalls.",
    content_en: "Leveraging nested layouts, streaming UI with React Suspense, and direct server-side data fetching eliminating client waterfalls."
  },
  { 
    id: 16, 
    journey_id: 105, 
    title: "Server Actions & Mutasi Data Real-Time", 
    title_en: "Server Actions & Real-Time Data Mutations",
    type: "text", 
    duration: "20:00",
    description: "Menghilangkan kebutuhan endpoint API manual dengan Server Actions native.",
    description_en: "Eliminating manual API route boilerplate with native Server Actions.",
    content: "Penanganan form submission aman, revalidasi cache on-demand dengan revalidatePath, dan implementasi optimistic UI updates.",
    content_en: "Handling secure form submissions, on-demand cache revalidation with revalidatePath, and optimistic UI updates."
  },
  { 
    id: 17, 
    journey_id: 105, 
    title: "Optimasi SEO, Metadata Dinamis, & Web Vitals", 
    title_en: "SEO Optimization, Dynamic Metadata, & Web Vitals",
    type: "video", 
    duration: "14:50",
    description: "Teknik mencapai skor performa sempurna pada Google Core Web Vitals.",
    description_en: "Techniques for achieving optimal performance scores on Google Core Web Vitals.",
    content: "Optimasi font self-hosted, rendering gambar otomatis next/image, dynamic Open Graph social cards, dan sitemap generation.",
    content_en: "Optimizing self-hosted fonts, automated next/image rendering, dynamic Open Graph social cards, and sitemap generation."
  },
  { 
    id: 18, 
    journey_id: 105, 
    title: "Mini Project: Deploy Full-Stack E-Learning Portal", 
    title_en: "Mini Project: Deploy Full-Stack E-Learning Portal",
    type: "quiz", 
    duration: "35:00",
    description: "Deploy aplikasi Next.js ke edge runtime dengan serverless database.",
    description_en: "Deploy Next.js applications to edge runtimes paired with serverless databases.",
    content: "Checklist persiapan production: caching headers, edge middleware, secure environment variables, dan monitoring performa.",
    content_en: "Production readiness checklist: caching headers, edge middleware, secure environment variables, and telemetry monitoring."
  },

  // Journey 106 - UI/UX Design
  { 
    id: 19, 
    journey_id: 106, 
    title: "Prinsip Desain Visual, Typography, & Color Theory", 
    title_en: "Visual Design Principles, Typography, & Color Theory",
    type: "video", 
    duration: "13:30",
    description: "Membangun rasa estetika, sistem grid 8pt, tipografi responsif, dan standar kontras WCAG.",
    description_en: "Cultivating aesthetic intuition, 8pt grid systems, responsive typography, and WCAG contrast standards.",
    content: "Pedoman mendesain UI yang ramah mata, konsisten, mudah dipindai, dan mendukung aksesibilitas untuk semua kalangan pengguna.",
    content_en: "Guidelines for crafting accessible, clean, and easily scannable user interfaces for diverse user demographics."
  },
  { 
    id: 20, 
    journey_id: 106, 
    title: "Membangun Design System & Komponen di Figma", 
    title_en: "Building Design Systems & Components in Figma",
    type: "text", 
    duration: "25:00",
    description: "Pemanfaatan Auto Layout, Component Variants, dan Design Tokens di Figma.",
    description_en: "Leveraging Auto Layout, Component Variants, and Design Tokens within Figma.",
    content: "Panduan membuat library komponen yang modular, atomic design principles, dan kemudahan serah terima ke tim engineer frontend.",
    content_en: "Constructing modular component libraries, atomic design principles, and streamlined developer handoff workflows."
  },
  { 
    id: 21, 
    journey_id: 106, 
    title: "Usability Testing & Evaluasi Alur Interaksi", 
    title_en: "Usability Testing & Interaction Flow Evaluation",
    type: "quiz", 
    duration: "20:00",
    description: "Validasi prototipe interaktif dengan user testing dan penyempurnaan alur tugas pengguna.",
    description_en: "Validating interactive prototypes with user research and refining user task flows.",
    content: "Penerapan metode System Usability Scale (SUS), observasi task completion rate, dan analisis feedback kualitatif pengguna.",
    content_en: "Applying System Usability Scale (SUS) methodologies, tracking task completion rates, and qualitative user feedback analysis."
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

// DATA CHART DASHBOARD DENGAN MAPPING HARI & MINGGU BILINGUAL
const dayLabelsEn = { Sen: 'Mon', Sel: 'Tue', Rab: 'Wed', Kam: 'Thu', Jum: 'Fri', Sab: 'Sat', Min: 'Sun' };
const weekLabelsEn = { 'Mgg 1': 'Wk 1', 'Mgg 2': 'Wk 2', 'Mgg 3': 'Wk 3', 'Mgg 4': 'Wk 4' };
const monthLabelsEn = { Jan: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr', Mei: 'May', Jun: 'Jun', Jul: 'Jul', Agu: 'Aug', Sep: 'Sep', Okt: 'Oct', Nov: 'Nov', Des: 'Dec' };

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

// --- 8. HELPER FUNGSI LOKALISASI KONTEN ---

/**
 * Mengembalikan objek Journey yang disesuaikan dengan bahasa yang aktif
 */
export const getLocalizedJourney = (journey, lang = 'id') => {
  if (!journey) return journey;
  const isEn = lang === 'en';
  return {
    ...journey,
    name: isEn && journey.name_en ? journey.name_en : journey.name,
    summary: isEn && journey.summary_en ? journey.summary_en : journey.summary,
    difficulty: isEn ? (journey.difficulty_en || journey.difficulty) : (journey.difficulty_id || journey.difficulty),
  };
};

/**
 * Mengembalikan array Journey yang dilokalisasi
 */
export const getLocalizedJourneys = (journeys, lang = 'id') => {
  if (!Array.isArray(journeys)) return [];
  return journeys.map(j => getLocalizedJourney(j, lang));
};

/**
 * Mengembalikan objek Tutorial / Modul yang disesuaikan dengan bahasa aktif
 */
export const getLocalizedTutorial = (tutorial, lang = 'id') => {
  if (!tutorial) return tutorial;
  const isEn = lang === 'en';
  return {
    ...tutorial,
    title: isEn && tutorial.title_en ? tutorial.title_en : tutorial.title,
    description: isEn && tutorial.description_en ? tutorial.description_en : tutorial.description,
    content: isEn && tutorial.content_en ? tutorial.content_en : tutorial.content,
  };
};

/**
 * Mengembalikan array Tutorial yang dilokalisasi
 */
export const getLocalizedTutorials = (tutorials, lang = 'id') => {
  if (!Array.isArray(tutorials)) return [];
  return tutorials.map(t => getLocalizedTutorial(t, lang));
};

/**
 * Menerjemahkan data bar chart berdasarkan bahasa
 */
export const getLocalizedChartItems = (items, lang = 'id') => {
  if (!Array.isArray(items) || lang !== 'en') return items;
  return items.map(item => {
    let newLabel = item.label;
    if (dayLabelsEn[item.label]) newLabel = dayLabelsEn[item.label];
    else if (weekLabelsEn[item.label]) newLabel = weekLabelsEn[item.label];
    else if (monthLabelsEn[item.label]) newLabel = monthLabelsEn[item.label];
    return { ...item, label: newLabel };
  });
};
