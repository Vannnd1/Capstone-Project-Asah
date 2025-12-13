# AI Learning Insight - Setup & Installation Guide

Panduan lengkap untuk setup dan menjalankan sistem AI Learning Insight.

---

## 📋 Prerequisites

- Python 3.10+
- Conda (Miniconda/Anaconda)
- Git

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd ai-learning-insight
```

### 2. Setup Environment

```bash
# Buat conda environment
conda create -n ai-learning-insight python=3.11 -y
conda activate ai-learning-insight

# Install dependencies
pip install uv
uv pip install -e ".[dev]"

# Atau dengan pip biasa
pip install -e ".[dev]"
```

### 3. Konfigurasi Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit .env (opsional - untuk GenAI insights)
# GOOGLE_API_KEY=your-google-api-key
```

### 4. Training Pipeline

```bash
# 1. Jalankan EDA (Exploratory Data Analysis)
python -m ai_learning_insight.eda.eda_analysis

# 2. Train ML Model
python -m ai_learning_insight.models.train

# 3. Train Recommender (hati-hati makan ram yang cukup besar)
python -m ai_learning_insight.recommender.market_basket
```

### 5. Seed Database

```bash
# Import users dari users.csv
python -m ai_learning_insight.database.seed_users

# Generate data sintesis untuk testing
python -m ai_learning_insight.database.seed_synthetic_data
```

### 6. Jalankan Aplikasi

```bash
# Terminal 1: Start API Server
uvicorn ai_learning_insight.api.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start Dashboard (ini hanya buat development api)
streamlit run ai_learning_insight/dashboard/streamlit_app.py
```

### 7. Akses Aplikasi

| Service                 | URL                         |
| ----------------------- | --------------------------- |
| API Swagger             | http://localhost:8000/docs  |
| API ReDoc               | http://localhost:8000/redoc |
| Dashboard (testing api) | http://localhost:8501       |

---

## 📁 Project Structure

```
ai-learning-insight/
├── ai_learning_insight/
│   ├── data/              # Data loading & cleaning
│   │   └── loader.py
│   ├── eda/               # Exploratory Data Analysis
│   │   └── eda_analysis.py
│   ├── features/          # Feature engineering
│   │   └── feature_engineering.py
│   ├── models/            # ML training & inference
│   │   ├── train.py
│   │   ├── infer.py
│   │   └── saved/         # Trained models
│   ├── recommender/       # Course recommendation
│   │   └── market_basket.py
│   ├── genai/             # AI insight generation
│   │   └── insight_generator.py
│   ├── api/               # FastAPI backend
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── auth/          # JWT authentication
│   │   ├── routes/        # API endpoints
│   │   └── schemas/       # Pydantic models
│   ├── dashboard/         # Streamlit UI
│   │   └── streamlit_app.py
│   ├── database/          # Database scripts
│   │   ├── seed_users.py
│   │   └── seed_synthetic_data.py
│   └── config.py          # Configuration
├── docs/                  # Documentation
│   └── API_DOCUMENTATION.md
├── outputs/               # Generated outputs
│   └── eda/               # EDA charts
├── data/                  # Raw CSV data files
├── pyproject.toml         # Dependencies
├── .env.example           # Environment template
└── README.md
```

---

## 🔧 Configuration

### Environment Variables (.env)

| Variable         | Description                                | Required             |
| ---------------- | ------------------------------------------ | -------------------- |
| `GOOGLE_API_KEY` | Google Gemini API key untuk GenAI insights | No                   |
| `SECRET_KEY`     | JWT secret key                             | No (auto-generated)  |
| `DATABASE_URL`   | Database connection string                 | No (default: SQLite) |

### Default Settings (config.py)

```python
# ML Settings
RANDOM_STATE = 42
TEST_SIZE = 0.2
MIN_TRAIN_SAMPLES = 1000
MIN_TEST_SAMPLES = 40

# Auth Settings
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours
```

---

## 📊 Data Files

| File                                | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `users.csv`                         | Data user (31 users)                     |
| `developer_journeys.csv`            | Data course/journey                      |
| `developer_journey_tutorials.csv`   | Data tutorial/modul                      |
| `developer_journey_trackings.csv`   | Tracking aktivitas user                  |
| `developer_journey_submissions.csv` | Data submission                          |
| `developer_journey_completions.csv` | Data completion                          |
| `exam_registrations.csv`            | Registrasi exam                          |
| `exam_results.csv`                  | Hasil exam                               |
| `student_features_synthetic.csv`    | Data sintesis untuk training (1500 rows) |

---

## 🧪 Testing

### Login Test

```bash
# Test login via curl
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"inggih_wicaksono","password":"student123"}'
```

### Default Test Users

| Username           | Learning Style     | Password     |
| ------------------ | ------------------ | ------------ |
| `inggih_wicaksono` | fast_learner       | `student123` |
| `budi_santosa`     | consistent_learner | `student123` |
| `rifath`           | reflective_learner | `student123` |
| `ledis_idola`      | passive_learner    | `student123` |

---

## 🔄 Reset Database

```bash
# Hapus database
rm ai_learning.db

# Re-seed
python -m ai_learning_insight.database.seed_users
python -m ai_learning_insight.database.seed_synthetic_data
```

---

## 🐛 Troubleshooting

### Error: ModuleNotFoundError

```bash
# Pastikan environment aktif
conda activate ai-learning-insight

# Reinstall package
pip install -e ".[dev]"
```

### Error: email-validator not installed

```bash
pip install email-validator
```

### Error: bcrypt compatibility

```bash
pip install bcrypt --upgrade
```

### Port Already in Use (LINUX)

```bash
# Kill process di port 8000
kill $(lsof -t -i:8000)

# Kill process di port 8501
kill $(lsof -t -i:8501)
```

### Port Already in Use (MAC)

```bash
# Kill process di port 8000
lsof -ti :8000 | xargs kill -9

# Kill process di port 8501
lsof -ti :8501 | xargs kill -9
```

### Port Already in Use (Windows)

```bash
# Kill process di port 8000
netstat -ano | findstr :8000 | awk '{print $5}' | xargs taskkill /F /PID

# Kill process di port 8501
netstat -ano | findstr :8501 | awk '{print $5}' | xargs taskkill /F /PID
```

## 📈 Model Performance

| Model              | Accuracy | CV Score |
| ------------------ | -------- | -------- |
| **RandomForest** ✓ | 98.67%   | 99.25%   |
| LightGBM           | 98.67%   | 99.17%   |
| LogisticRegression | 98.67%   | 98.92%   |
| XGBoost            | 98.33%   | 98.75%   |

---

## 📚 Learning Styles

| Style                   | Karakteristik                                       |
| ----------------------- | --------------------------------------------------- |
| 🚀 `fast_learner`       | Belajar cepat, intensitas tinggi, banyak completion |
| 📅 `consistent_learner` | Belajar teratur, ritme stabil                       |
| 🤔 `reflective_learner` | Belajar mendalam, butuh waktu lebih                 |
| 😴 `passive_learner`    | Aktivitas rendah, perlu motivasi                    |

---
