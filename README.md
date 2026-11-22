# 🎓 AI Learning Insight (Web App)

Platform analitik pembelajaran adaptif berbasis kecerdasan buatan (*Artificial Intelligence*) yang menganalisis telemetri dan kebiasaan belajar siswa, mengidentifikasi gaya belajar (*learning style*), memberikan wawasan serta motivasi belajar personal melalui integrasi **Google Gemini API**, dan memberikan rekomendasi kursus yang relevan.

---

## 📋 Daftar Isi

1. [Tentang Proyek](#-tentang-proyek)
2. [Fitur Utama](#-fitur-utama)
3. [Arsitektur Sistem](#-arsitektur-sistem)
4. [Teknologi yang Digunakan (Tech Stack)](#-teknologi-yang-digunakan-tech-stack)
5. [Struktur Direktori](#-struktur-direktori)
6. [Prasyarat Sistem](#-prasyarat-sistem)
7. [Panduan Instalasi & Menjalankan Proyek](#-panduan-instalasi--menjalankan-proyek)
   - [Opsi A: Menjalankan Backend (FastAPI) & Frontend (React/Vite)](#opsi-a-menjalankan-backend-fastapi--frontend-reactvite)
   - [Opsi B: Menjalankan Cepat dengan Mock Server (Node.js)](#opsi-b-menjalankan-cepat-dengan-mock-server-nodejs)
   - [Opsi C: Menjalankan dengan Docker Compose](#opsi-c-menjalankan-dengan-docker-compose)
8. [Akun Demo Default](#-akun-demo-default)
9. [Konfigurasi Environment Variables](#-konfigurasi-environment-variables)
10. [Dokumentasi API Endpoints](#-dokumentasi-api-endpoints)
11. [Klasifikasi Gaya Belajar (*Learning Styles*)](#-klasifikasi-gaya-belajar-learning-styles)
12. [Lisensi](#-lisensi)

---

## 🎯 Tentang Proyek

**AI Learning Insight** dirancang untuk membantu peserta didik dan pengajar memahami pola belajar secara mendalam melalui pemanfaatan analitik data dan *Machine Learning*.

Sistem ini bekerja dengan cara:
1. **Merekam Aktivitas Pembelajaran**: Mengumpulkan data aksi pengguna (penyelesaian modul, pengumpulan tugas, kuis, dan interaksi harian).
2. **Menganalisis Pola & Perilaku**: Mengukur kecepatan belajar (*velocity*), konsistensi kehadiran (*consistency*), dan tingkat keterlibatan (*engagement score*).
3. **Mengklasifikasikan Gaya Belajar**: Menentukan profil gaya belajar siswa (misal: *Fast Learner*, *Consistent Learner*, *Reflective Learner*, atau *Passive Learner*).
4. **Memberikan Insight Cerdas Berbasis AI**: Menghasilkan umpan balik, evaluasi progres, dan dorongan motivasi personal secara otomatis menggunakan model bahasa besar (**Google Gemini 1.5 Flash**).
5. **Rekomendasi Jalur Belajar**: Memberikan saran kursus atau modul selanjutnya berdasarkan riwayat dan performa belajar.

---

## ✨ Fitur Utama

- 🔐 **Autentikasi & Profil Pengguna**
  - Registrasi pengguna baru dan Login berbasis token JWT (*JSON Web Token*).
  - Enkripsi kata sandi yang aman menggunakan `bcrypt`.
  - Pemulihan sesi otomatis (*Session Restore*) saat halaman dimuat ulang.
  - Pengaturan target belajar harian (*Santai* 1 modul/hari, *Fokus* 3 modul/hari, atau *Hardcore* 5+ modul/hari).
  - Pemilih avatar profil interaktif dengan tema Netflix, Robot, Petualang, dan Kartun.

- 📊 **Dashboard Pembelajaran Real-time**
  - Ringkasan metrik belajar: total modul selesai, hari aktif, rata-rata durasi belajar, dan streak harian.
  - Kartu AI Insight yang dinamis dan terpersonalisasi.
  - Grafik tren aktivitas dan visualisasi progres pembelajaran.

- 🧠 **Analisis & Klasifikasi Gaya Belajar (Machine Learning)**
  - Pengenalan 4 tipe gaya belajar beserta skor keyakinan (*confidence score*).
  - Analisis perilaku komprehensif: kecepatan penyelesaian modul, konsistensi ritme belajar, dan level keterlibatan.
  - Visualisasi Radar Chart untuk pemetaan berbagai dimensi kompetensi/keahlian.

- 🤖 **AI Learning Coach (Google Gemini Integration)**
  - Integrasi dengan API Gemini untuk menghasilkan pesan umpan balik harian yang kontekstual dengan target belajar dan capaian siswa.
  - Dilengkapi mekanisme cadangan (*fallback*) cerdas berbasis aturan (*rule-based*) jika API Key Gemini tidak dipasang.

- 📚 **Rekomendasi Kursus Adaptif**
  - Katalog kursus dengan skor relevansi dan alasan rekomendasi yang disesuaikan dengan aktivitas belajar siswa.

- 🎨 **Pengalaman Pengguna Modern (UI/UX)**
  - Tampilan modern, bersih, dan responsif untuk berbagai ukuran layar menggunakan Tailwind CSS.
  - Dukungan **Mode Gelap / Terang** (*Dark & Light Theme*).
  - Dukungan multi-bahasa: **Bahasa Indonesia** dan **Bahasa Inggris**.

---

## 🏗 Arsitektur Sistem

```
┌─────────────────────────────────┐
│     Frontend (React 19 + Vite)  │
│     Port: 5173                  │
└────────────────┬────────────────┘
                 │
                 │ HTTP / REST API (JWT Bearer Token)
                 ▼
┌─────────────────────────────────┐        ┌────────────────────────────┐
│      Backend (FastAPI)          │───────►│  Google Gemini 1.5 Flash   │
│      Port: 8000                 │        │  (AI Personalized Insight) │
└────────────────┬────────────────┘        └────────────────────────────┘
                 │
                 │ SQLAlchemy ORM
                 ▼
┌─────────────────────────────────┐
│ Database:                       │
│ - SQLite (Lokal: ai_learning.db)│
│   atau                          │
│ - PostgreSQL (Supabase / Docker)│
└─────────────────────────────────┘
```

---

## 🛠 Teknologi yang Digunakan (Tech Stack)

### Frontend
- **Framework / Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) & PostCSS
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Visualisasi Data**: [Recharts 3.5](https://recharts.org/)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Manajemen State**: React Context API (`AuthContext`, `LearningContext`, `AppContext`)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Server ASGI**: [Uvicorn](https://www.uvicorn.org/)
- **Database ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
- **Database Engine**: SQLite (bawaan lokal) atau PostgreSQL (Supabase / Docker)
- **Validasi Data**: [Pydantic v2](https://docs.pydantic.dev/) & `pydantic-settings`
- **Keamanan & Autentikasi**: `PyJWT` (JWT tokens) dan `bcrypt` (hashing kata sandi)
- **Integrasi AI**: Google Gemini API via REST (`generativelanguage.googleapis.com`)

### Opsi Pengujian Cepat
- **Mock Server**: Node.js HTTP Server (`mock-server.js` & `mock_db.json`)
- **Kontainerisasi**: Docker & Docker Compose

---

## 📁 Struktur Direktori

```
ai-learning-insight/
├── backend/                        # Backend API berbasis FastAPI
│   ├── app/
│   │   ├── models/                 # Model database SQLAlchemy (User, Activity, Insight)
│   │   ├── routes/                 # Router API (/auth, /api/learning, /profile)
│   │   ├── schemas/                # Skema validasi Pydantic
│   │   ├── services/               # Logika bisnis (Auth, ML, Insight, Recommender)
│   │   ├── config.py               # Konfigurasi & pembacaan environment variables
│   │   ├── database.py             # Koneksi engine & session database
│   │   └── main.py                 # Titik masuk utama aplikasi FastAPI
│   ├── .env.example                # Contoh file variabel lingkungan backend
│   ├── Dockerfile                  # Definisi Docker container backend
│   ├── docker-compose.yml          # Konfigurasi Docker compose backend & PostgreSQL
│   ├── requirements.txt            # Daftar pustaka Python yang dibutuhkan
│   └── README.md                   # Dokumentasi khusus backend
├── frontend/                       # Aplikasi frontend berbasis React & Vite
│   ├── public/                     # Aset statis & koleksi avatar SVG
│   ├── src/
│   │   ├── components/             # Komponen UI yang dapat digunakan kembali
│   │   ├── context/                # Penyedia state (Auth, Learning, App)
│   │   ├── data/                   # Data statis & daftar avatar
│   │   ├── pages/                  # Halaman aplikasi (Dashboard, Analytics, dll.)
│   │   ├── services/               # Layanan HTTP request ke backend (ApiService)
│   │   ├── App.jsx                 # Routing & wrapper aplikasi utama
│   │   ├── main.jsx                # Titik masuk React DOM
│   │   └── index.css               # Konfigurasi CSS Tailwind global
│   ├── .env.example                # Contoh file variabel lingkungan frontend
│   ├── package.json                # Daftar dependensi & script Node.js
│   ├── tailwind.config.js          # Konfigurasi styling Tailwind CSS
│   ├── vite.config.js              # Konfigurasi Vite
│   ├── API_DOCUMENTATION.md        # Dokumentasi detail spesifikasi API frontend
│   ├── SETUP_GUIDE.md              # Panduan setup lanjutan
│   └── README.md                   # Dokumentasi khusus frontend
├── mock-server.js                  # Server tiruan Node.js mandiri untuk pengujian
├── mock_db.json                    # Basis data JSON untuk mock-server
└── README.md                       # Dokumentasi utama proyek (file ini)
```

---

## ⚙️ Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terinstal:
- **Node.js**: Versi 18.0.0 atau lebih baru (atau [Bun](https://bun.sh/))
- **Python**: Versi 3.10 atau lebih baru
- **Git**: Untuk manajemen repositori (opsional)
- **Docker & Docker Compose**: Jika ingin menjalankan dengan kontainer (opsional)

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### Opsi A: Menjalankan Backend (FastAPI) & Frontend (React/Vite)

Metode ini disarankan untuk pengembangan penuh dengan fitur *machine learning* dan autentikasi lengkap.

#### 1. Setup & Jalankan Backend (Terminal 1)

1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```

2. Buat dan aktifkan lingkungan virtual (*virtual environment*):
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Instal semua dependensi Python:
   ```bash
   pip install -r requirements.txt
   ```

4. Buat file `.env` dari template:
   - **Windows:**
     ```powershell
     copy .env.example .env
     ```
   - **Linux / macOS:**
     ```bash
     cp .env.example .env
     ```
   *(Opsional: Masukkan `GOOGLE_API_KEY` Anda di dalam `.env` jika ingin mengaktifkan generator wawasan Gemini AI).*

5. Jalankan server FastAPI:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   Server backend akan aktif di: **`http://localhost:8000`**  
   Dokumentasi interaktif Swagger UI tersedia di: **`http://localhost:8000/docs`**

---

#### 2. Setup & Jalankan Frontend (Terminal 2)

1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```

2. Instal dependensi Node.js:
   ```bash
   npm install
   # atau jika menggunakan bun:
   bun install
   ```

3. Siapkan file `.env`:
   - **Windows:**
     ```powershell
     copy .env.example .env
     ```
   - **Linux / macOS:**
     ```bash
     cp .env.example .env
     ```
   Pastikan isi `.env` mengarah ke backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   # atau dengan bun:
   bun run dev
   ```

5. Buka peramban (*browser*) dan akses:  
   👉 **`http://localhost:5173`**

---

### Opsi B: Menjalankan Cepat dengan Mock Server (Node.js)

Jika Anda hanya ingin menguji tampilan antarmuka (frontend) tanpa perlu menginstal Python dan dependensi backend:

1. Di direktori utama proyek (`ai-learning-insight`), jalankan:
   ```bash
   node mock-server.js
   ```
   Server tiruan akan aktif di port `8000` dan menyimpan perubahan data sementara ke `mock_db.json`.

2. Buka terminal kedua, masuk ke folder `frontend` dan jalankan:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Buka browser di **`http://localhost:5173`**.

---

### Opsi C: Menjalankan dengan Docker Compose

Jika Anda telah menginstal Docker Desktop, Anda dapat menjalankan backend beserta PostgreSQL secara terisolasi:

```bash
cd backend
docker-compose up -d --build
```

Layanan backend akan otomatis tersambung ke kontainer PostgreSQL dan terbuka di port `8000`.

---

## 👤 Akun Demo Default

Saat backend pertama kali dijalankan, sistem secara otomatis menyiapkan akun demo siap pakai:

| Field | Kredensial Demo |
| :--- | :--- |
| **Username** | `siswa_demo` |
| **Password** | `password123` |
| **Nama Tampilan** | Siswa Teladan |
| **Target Belajar** | Fokus (3 modul/hari) |

*Catatan: Anda juga dapat mendaftarkan akun baru melalui tombol **Daftar** pada modal autentikasi.*

---

## 🔐 Konfigurasi Environment Variables

### Variabel Lingkungan Backend (`backend/.env`)

| Variabel | Default | Keterangan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `sqlite:///./ai_learning.db` | URL koneksi database (SQLite lokal atau PostgreSQL Supabase). |
| `JWT_SECRET` | *(string acak)* | Kunci rahasia untuk enkripsi token JWT. |
| `JWT_ALGORITHM` | `HS256` | Algoritma tanda tangan token JWT. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Masa berlaku token JWT dalam satuan menit (1440 = 24 jam). |
| `GOOGLE_API_KEY` | *(kosong)* | Kunci API Google Gemini untuk evaluasi belajar AI (opsional). |
| `PORT` | `8000` | Port listen server FastAPI. |
| `HOST` | `0.0.0.0` | Host alamat jaringan server. |
| `CORS_ORIGINS` | `*` | Daftar origin URL frontend yang diizinkan mengakses API. |

### Variabel Lingkungan Frontend (`frontend/.env`)

| Variabel | Default | Keterangan |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Alamat endpoint dasar backend API yang dipanggil frontend. |

---

## 📡 Dokumentasi API Endpoints

Semua endpoint dilindungi menggunakan header `Authorization: Bearer <TOKEN>`, kecuali endpoint registrasi, login, dan *health check*.

### Autentikasi & Akun
- `POST /auth/register` : Mendaftarkan akun pengguna baru.
- `POST /auth/login` : Masuk menggunakan username & password, mengembalikan token JWT.
- `POST /auth/logout` : Keluar dari sesi dan mengakhiri token.
- `GET /auth/me` : Mengambil data profil dan sesi pengguna yang sedang aktif.
- `PUT /api/profile/update` : Memperbarui nama tampilan, avatar, dan target belajar pengguna.

### Analitik Pembelajaran & AI
- `GET /api/learning/telemetry` : Mengambil data gaya belajar, skor keyakinan, metrik kecepatan, konsistensi, dan keterlibatan.
- `GET /api/learning/insight` : Menghasilkan saran belajar personal terbaru berbasis AI (Gemini).
- `GET /api/learning/insight/history` : Mengambil riwayat catatan insight belajar pengguna sebelumnya.
- `GET /api/learning/recommendation` : Mengambil daftar rekomendasi kursus yang dipersonalisasi.
- `POST /api/learning/activity` : Mencatat aktivitas belajar baru (misal: selesai membaca modul, submit tugas).
- `GET /api/learning/activity` : Mengambil seluruh riwayat log aktivitas belajar pengguna.

### Sistem & Status
- `GET /` : Informasi status dan versi API.
- `GET /health` : Health check status layanan.
- `GET /docs` : Dokumentasi interaktif Swagger UI.
- `GET /redoc` : Dokumentasi interaktif ReDoc.

---

## 🧠 Klasifikasi Gaya Belajar (*Learning Styles*)

Sistem analitik mengklasifikasikan siswa ke dalam salah satu dari empat kategori gaya belajar:

1. **Pembelajar Cepat (*Fast Learner*)**  
   Menyelesaikan materi dan modul dengan akselerasi tinggi dalam waktu singkat. Disarankan mendapatkan materi pengayaan yang lebih menantang.
2. **Pembelajar Konsisten (*Consistent Learner*)**  
   Memiliki jadwal belajar harian yang teratur, stabil, dan disiplin menyelesaikan target sedikit demi sedikit secara konsisten.
3. **Pembelajar Reflektif (*Reflective Learner*)**  
   Mempelajari modul secara mendalam, membutuhkan waktu lebih lama untuk memahami konsep sebelum melanjutkan ke tahap kuis atau tugas.
4. **Pembelajar Pasif (*Passive Learner*)**  
   Frekuensi akses dan aktivitas belajar masih minim atau tidak teratur. Sistem memberikan notifikasi pengingat dan motivasi untuk membangun kebiasaan belajar.

---

## 📜 Lisensi

Proyek ini dirilis di bawah lisensi [MIT License](LICENSE). Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini untuk keperluan edukasi maupun komersial sesuai ketentuan lisensi.
