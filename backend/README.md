# AI Learning Insight - Backend API (FastAPI)

Backend layanan Machine Learning & Adaptive Learning Analytics untuk platform **AI Learning Insight**. Dibangun dengan **FastAPI**, **SQLAlchemy**, dan mendukung database **PostgreSQL (Supabase)** serta **SQLite**.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi JWT**: Register pengguna baru, Login, Session Restore (`/auth/me`), dan Logout dengan enkripsi password `bcrypt`.
- 📊 **Telemetri Pembelajaran & Prediksi ML**: Mengidentifikasi gaya belajar siswa (*Fast Learner*, *Consistent Learner*, *Reflective Learner*, atau *Passive Learner*) beserta skor konfidensi dan analisis perilaku.
- 🧠 **AI Insights**: Generator insight personalisasi belajar harian (termasuk integrasi Google Gemini API).
- 📚 **Rekomendasi Kursus**: Analisis preferensi kursus berbasis korelasi modul belajar.
- 🐳 **Docker-Ready**: Dilengkapi `Dockerfile` & `docker-compose.yml` multi-platform.
- 📖 **Dokumentasi Interaktif**: Otomatis menghasilkan Swagger UI di `/docs` dan ReDoc di `/redoc`.

---

## 🛠 Panduan Menjalankan di Lokal

### 1. Masuk ke direktori backend
```bash
cd backend
```

### 2. Install dependensi
```bash
pip install -r requirements.txt
```

### 3. Konfigurasi Environment (`.env`)
Salin file template `.env.example`:
```bash
cp .env.example .env
```
Secara default, jika `DATABASE_URL` tidak diisi, backend otomatis menggunakan SQLite lokal (`ai_learning.db`).

### 4. Jalankan Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Buka dokumentasi Swagger UI di: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🗄 Integrasi Database Supabase (Cloud PostgreSQL)

1. Buka [Supabase](https://supabase.com) dan buat project baru gratis.
2. Di menu **Project Settings** > **Database** > **Connection string** (URI), salin connection URI Anda:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
3. Tempelkan ke variabel `DATABASE_URL` di file `.env` backend Anda.
4. Ketika backend dijalankan, semua tabel (`users`, `activities`, `insights`) akan otomatis terbuat di database Supabase Anda.

---

## 🚢 Panduan Deployment

### Opsi 1: Deploy ke Render (Gratis)
1. Push repositori ini ke GitHub.
2. Buat akun di [Render](https://render.com).
3. Klik **New +** > **Web Service**, hubungkan repository GitHub Anda.
4. Tentukan konfigurasi:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Tambahkan **Environment Variables**:
   - `DATABASE_URL`: Connection string Supabase PostgreSQL Anda.
   - `JWT_SECRET`: Kunci rahasia JWT Anda.
   - `CORS_ORIGINS`: URL domain frontend Anda (misal: `https://my-portfolio-frontend.vercel.app`).

### Opsi 2: Deploy Menggunakan Docker
```bash
# Build image
docker build -t ai-learning-backend .

# Run container
docker run -d -p 8000:8000 --env-file .env ai-learning-backend
```
Atau menggunakan `docker-compose`:
```bash
docker-compose up -d --build
```
