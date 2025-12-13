# AI Learning Insight

Platform pembelajaran adaptif berbasis AI yang menganalisis gaya belajar siswa dan memberikan rekomendasi personal.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur](#-arsitektur)
- [Instalasi](#-instalasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Project](#-struktur-project)
- [API Endpoints](#-api-endpoints)
- [Komponen](#-komponen)
- [Context & State Management](#-context--state-management)

---

## 🎯 Tentang Project

**AI Learning Insight** adalah sistem analisis pembelajaran yang menggunakan Machine Learning untuk:

1. **Mengidentifikasi Gaya Belajar** - Klasifikasi siswa menjadi 4 tipe: Fast Learner, Consistent Learner, Reflective Learner, atau Passive Learner
2. **Generate Insight AI** - Memberikan insight dan saran belajar personal menggunakan AI
3. **Rekomendasi Course** - Market Basket Analysis untuk merekomendasikan course relevan
4. **Visualisasi Progress** - Dashboard interaktif dengan grafik dan metrik

---

## ✨ Fitur Utama

| Fitur                  | Deskripsi                                       |
| ---------------------- | ----------------------------------------------- |
| 🔐 **Authentication**  | Register, Login, Session restore dengan JWT     |
| 📊 **Dashboard**       | Statistik belajar, grafik aktivitas, AI insight |
| 🧠 **Analytics**       | Radar chart skill, learning style analysis      |
| 📚 **Recommendations** | Rekomendasi course berdasarkan aktivitas        |
| 🌙 **Dark Mode**       | Support tema gelap/terang                       |
| 🌐 **Multi-Language**  | Bahasa Indonesia & English                      |

---

## 🛠 Tech Stack

### Frontend

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| **React 19**       | UI Library                |
| **Vite**           | Build tool & dev server   |
| **TailwindCSS**    | Styling                   |
| **React Router 7** | Client-side routing       |
| **Recharts**       | Visualisasi data (charts) |
| **Lucide React**   | Icon library              |

### Backend

| Technology       | Purpose                          |
| ---------------- | -------------------------------- |
| **FastAPI**      | REST API framework               |
| **SQLite**       | Database                         |
| **JWT**          | Authentication                   |
| **scikit-learn** | ML untuk prediksi learning style |

---

## 🏗 Arsitektur

```
┌─────────────────┐     HTTP/REST     ┌─────────────────┐
│                 │    + JWT Auth     │                 │
│    Frontend     │◄─────────────────►│     Backend     │
│   (React/Vite)  │                   │    (FastAPI)    │
│   Port: 5173    │                   │   Port: 8000    │
└─────────────────┘                   └─────────────────┘
        │                                      │
        │                                      │
        ▼                                      ▼
┌─────────────────┐                   ┌─────────────────┐
│   Contexts:     │                   │    SQLite DB    │
│ - AuthContext   │                   │ - users         │
│ - LearningCtx   │                   │ - activities    │
│ - AppContext    │                   │ - insights      │
└─────────────────┘                   └─────────────────┘
```

---

## 📦 Instalasi

### Prerequisites

- Node.js 18+ atau Bun
- Python 3.10+ (untuk backend)

### Frontend Setup

```bash
# Clone repository
cd ai-learning-insight/frontend

# Install dependencies
npm install
# atau dengan bun
bun install
```

### Backend Setup

Dibaca file README [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 🚀 Menjalankan Aplikasi

### Development Mode

**Terminal 1 - Backend:**

Dibaca file README [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# atau
bun run dev
```

Buka browser: `http://localhost:5173`

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

---

## 📁 Struktur Project

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts
│   ├── components/        # Reusable UI components
│   │   ├── AIInsightCard.jsx
│   │   ├── AuthModal.jsx
│   │   ├── AvatarDropdown.jsx
│   │   ├── HeaderAvatar.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── ProgressChart.jsx
│   ├── context/           # React Context providers
│   │   ├── AppContext.jsx     # Theme & language
│   │   ├── AuthContext.jsx    # Authentication
│   │   └── LearningContext.jsx # Learning data
│   ├── pages/             # Route pages
│   │   ├── Analytics.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LandingPage.jsx
│   │   ├── MyCourses.jsx
│   │   ├── ProfileSettings.jsx
│   │   ├── Settings.jsx
│   │   └── Target.jsx
│   ├── services/          # API services
│   │   └── ApiService.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── API_DOCUMENTATION.md
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000`

### Authentication

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/auth/register` | Register user baru          |
| POST   | `/auth/login`    | Login (username + password) |
| POST   | `/auth/logout`   | Logout dan invalidate token |
| GET    | `/auth/me`       | Get current user info       |

### Learning Data

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/api/learning/telemetry`       | Get learning style & metrics |
| GET    | `/api/learning/insight`         | Get AI-generated insight     |
| GET    | `/api/learning/insight/history` | Get insight history          |
| GET    | `/api/learning/recommendation`  | Get course recommendations   |
| POST   | `/api/learning/activity`        | Log learning activity        |
| GET    | `/api/learning/activity`        | Get activity history         |

> 📖 Dokumentasi lengkap: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🧩 Komponen

### Core Components

| Component        | File                            | Description                 |
| ---------------- | ------------------------------- | --------------------------- |
| `AuthModal`      | `components/AuthModal.jsx`      | Modal login/register        |
| `AIInsightCard`  | `components/AIInsightCard.jsx`  | Kartu insight AI            |
| `AvatarDropdown` | `components/AvatarDropdown.jsx` | Avatar dengan dropdown menu |
| `Layout`         | `components/Layout.jsx`         | Layout dengan sidebar       |
| `ProgressChart`  | `components/ProgressChart.jsx`  | Grafik progress belajar     |

### Pages

| Page              | Route                 | Description          |
| ----------------- | --------------------- | -------------------- |
| `LandingPage`     | `/` (unauthenticated) | Halaman landing      |
| `Dashboard`       | `/` (authenticated)   | Dashboard utama      |
| `Analytics`       | `/analytics`          | Analisis AI mendalam |
| `MyCourses`       | `/courses`            | Daftar course saya   |
| `Settings`        | `/settings`           | Pengaturan umum      |
| `ProfileSettings` | `/settings/profile`   | Edit profil          |

---

## 🔄 Context & State Management

### AuthContext

Mengelola state autentikasi:

- `user` - Data user yang login
- `isAuthenticated` - Status login
- `login(username, password)` - Fungsi login
- `register(userData)` - Fungsi register
- `logout()` - Fungsi logout

### LearningContext

Mengelola data pembelajaran:

- `telemetry` - Data learning style & metrics
- `insight` - AI insight terbaru
- `recommendations` - Rekomendasi course
- `fetchTelemetry()` - Fetch data telemetry
- `getLearningStyleLabel(style)` - Helper label

### AppContext

Mengelola preferensi UI:

- `darkMode` - Status dark mode
- `language` - Bahasa aktif (id/en)
- `toggleTheme()` - Toggle dark mode
- `t(key)` - Fungsi translate

---

## 📊 Learning Styles

| Style                | Label                | Karakteristik                    |
| -------------------- | -------------------- | -------------------------------- |
| `fast_learner`       | Pembelajar Cepat     | Belajar cepat, intensitas tinggi |
| `consistent_learner` | Pembelajar Konsisten | Ritme stabil, teratur            |
| `reflective_learner` | Pembelajar Reflektif | Mendalam, butuh waktu            |
| `passive_learner`    | Pembelajar Pasif     | Aktivitas rendah                 |

---

## 🔒 Security

- JWT token stored di `localStorage`
- Token dikirim via `Authorization: Bearer` header
- Auto-restore session saat refresh
- Token expired handling

---

## 📝 Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production
npm run preview

# Linting
npm run lint
```

---

## 👥 Tim

Dikembangkan sebagai bagian dari project AI Learning Insight.

---

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.
