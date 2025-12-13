# AI Learning Insight - API Documentation

Dokumentasi API untuk integrasi frontend dengan sistem AI Learning Insight.

## Base URL

```
http://localhost:8000
```

---

## Authentication

API menggunakan **JWT Bearer Token** untuk autentikasi. Token dikirim via header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 🔐 Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "display_name": "John Doe"
}
```

**Response (201 Created):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "display_name": "John Doe",
    "created_at": "2025-12-13T10:00:00",
    "is_active": true
  }
}
```

---

#### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "display_name": "John Doe",
    "created_at": "2025-12-13T10:00:00",
    "is_active": true
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "detail": "Invalid username or password"
}
```

---

#### Logout

```http
POST /auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**

```json
{
  "message": "Successfully logged out",
  "success": true
}
```

---

#### Get Current User

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "display_name": "John Doe",
  "created_at": "2025-12-13T10:00:00",
  "is_active": true
}
```

---

### 📊 Learning Telemetry

#### Get User Telemetry

Mendapatkan telemetri pembelajaran user termasuk prediksi gaya belajar.

```http
GET /api/learning/telemetry
```

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**

```json
{
  "learning_style": "fast_learner",
  "confidence": 0.87,
  "user_metrics": {
    "total_activities": 450,
    "completed_modules": 75,
    "total_submissions": 20,
    "days_active": 25,
    "max_daily_completions": 12,
    "engagement_score": 185
  },
  "behavior_analysis": {
    "consistency": "very_high",
    "velocity": "very_fast",
    "engagement_level": "excellent"
  },
  "generated_at": "2025-12-13T10:30:00"
}
```

**Learning Styles:**
| Style | Description |
|-------|-------------|
| `fast_learner` | Belajar cepat dengan intensitas tinggi |
| `consistent_learner` | Belajar teratur dengan ritme stabil |
| `reflective_learner` | Belajar mendalam, butuh waktu lebih |
| `passive_learner` | Aktivitas rendah, perlu motivasi |

---

### 🧠 AI Insights

#### Get AI Insight

Mendapatkan insight yang di-generate AI berdasarkan telemetri user.

```http
GET /api/learning/insight
```

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**

```json
{
  "id": 42,
  "insight_text": "Hebat! Kamu sudah menyelesaikan 75 modul dalam 25 hari aktif. Kecepatan belajarmu sangat impresif! Tantang dirimu dengan materi yang lebih advance untuk terus berkembang.",
  "insight_type": "general",
  "learning_style": "fast_learner",
  "created_at": "2025-12-13T10:35:00"
}
```

---

#### Get Insight History

```http
GET /api/learning/insight/history?limit=10&offset=0
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | int | 10 | Jumlah insight per halaman (1-100) |
| `offset` | int | 0 | Offset untuk pagination |

**Response (200 OK):**

```json
{
  "insights": [
    {
      "id": 42,
      "insight_text": "Hebat! Kamu sudah menyelesaikan...",
      "insight_type": "general",
      "learning_style": "fast_learner",
      "created_at": "2025-12-13T10:35:00"
    }
  ],
  "total": 15
}
```

---

### 📚 Course Recommendations

#### Get Recommendations

Mendapatkan rekomendasi course berdasarkan Market Basket Analysis.

```http
GET /api/learning/recommendation?n=5
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `n` | int | 5 | Jumlah rekomendasi (1-20) |

**Response (200 OK):**

```json
{
  "recommendations": [
    {
      "journey_id": 5,
      "name": "Belajar Dasar AI",
      "score": 0.96,
      "reason": "Based on similar learning paths"
    },
    {
      "journey_id": 12,
      "name": "Memulai Pemrograman dengan Python",
      "score": 0.89,
      "reason": "Popular among other learners"
    }
  ],
  "generated_at": "2025-12-13T10:40:00"
}
```

---

### 📈 Activity Logging

#### Log Activity

Mencatat aktivitas pembelajaran baru.

```http
POST /api/learning/activity
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "journey_id": 5,
  "tutorial_id": 42,
  "action": "complete",
  "duration_seconds": 1200
}
```

**Action Types:**
| Action | Description |
|--------|-------------|
| `view` | User melihat konten |
| `complete` | User menyelesaikan modul |
| `submit` | User submit tugas/quiz |

**Response (201 Created):**

```json
{
  "id": 156,
  "journey_id": 5,
  "tutorial_id": 42,
  "action": "complete",
  "duration_seconds": 1200,
  "timestamp": "2025-12-13T10:45:00"
}
```

---

#### Get Activity History

```http
GET /api/learning/activity?limit=50
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | int | 50 | Jumlah activity (1-200) |

**Response (200 OK):**

```json
[
  {
    "id": 156,
    "journey_id": 5,
    "tutorial_id": 42,
    "action": "complete",
    "duration_seconds": 1200,
    "timestamp": "2025-12-13T10:45:00"
  }
]
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "detail": "Not authenticated"
}
```

### 400 Bad Request

```json
{
  "detail": "Username already registered"
}
```

### 422 Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

---

## Frontend Integration Example

### JavaScript/Fetch

```javascript
// Login
const login = async (username, password) => {
  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

// Get Telemetry (with auth)
const getTelemetry = async (token) => {
  const response = await fetch("http://localhost:8000/api/learning/telemetry", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
```

### React Hook Example

```javascript
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setUser(data.user);
    }
    return data;
  };

  return { token, user, login };
};
```

---

## Swagger UI

Dokumentasi interaktif tersedia di:

```
http://localhost:8000/docs
```

ReDoc tersedia di:

```
http://localhost:8000/redoc
```
