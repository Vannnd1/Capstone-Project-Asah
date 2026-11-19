from datetime import datetime
from typing import Optional
import requests
from app.config import GOOGLE_API_KEY
from app.models.user import User
from app.schemas.learning import TelemetryResponse, InsightResponse

def generate_ai_insight(user: User, telemetry: TelemetryResponse) -> InsightResponse:
    display_name = user.display_name or user.username
    style = telemetry.learning_style
    metrics = telemetry.user_metrics

    # Check if Gemini API can be utilized
    if GOOGLE_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GOOGLE_API_KEY}"
            prompt = (
                f"Kamu adalah AI Learning Insight Coach. Berikan kalimat evaluasi dan motivasi belajar personal "
                f"untuk siswa bernama '{display_name}' yang teridentifikasi sebagai gaya belajar '{style}'. "
                f"Data belajar: {metrics.completed_modules} modul selesai, {metrics.total_activities} aktivitas, "
                f"skor engagement {metrics.engagement_score}. Buat maksimal 2 kalimat ramah dan memotivasi dalam Bahasa Indonesia."
            )
            resp = requests.post(
                url,
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=5
            )
            if resp.status_code == 200:
                result = resp.json()
                text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
                if text:
                    return InsightResponse(
                        id=int(datetime.utcnow().timestamp()),
                        insight_text=text,
                        insight_type="ai_generated",
                        learning_style=style,
                        created_at=datetime.utcnow()
                    )
        except Exception as e:
            # Fallback to smart rule-based engine if Gemini call fails
            pass

    # Built-in intelligent narrative engine
    if style == "fast_learner":
        text = (
            f"Luar biasa, {display_name}! Kamu menyelesaikan modul dengan ritme sangat cepat dan pemahaman tinggi. "
            f"Tantang dirimu dengan proyek tingkat mahir berikutnya untuk memperdalam pengalaman praktismu!"
        )
    elif style == "consistent_learner":
        text = (
            f"Hebat, {display_name}! Konsistensi belajarmu harian sangat stabil. "
            f"Pertahankan kebiasaan produktif ini untuk mencapai target belajar mingguanmu secara teratur."
        )
    elif style == "reflective_learner":
        text = (
            f"Bagus sekali, {display_name}! Kamu mempelajari setiap konsep secara mendalam dan menyeluruh. "
            f"Coba terapkan materi yang baru kamu pelajari ke dalam mini-project untuk melihat langsung dampaknya."
        )
    else:
        text = (
            f"Selamat datang, {display_name}! Mulailah dengan menyelesaikan 1 modul pendek hari ini. "
            f"Langkah kecil yang konsisten akan membangun momentum belajar yang luar biasa!"
        )

    return InsightResponse(
        id=int(datetime.utcnow().timestamp()),
        insight_text=text,
        insight_type="rule_based",
        learning_style=style,
        created_at=datetime.utcnow()
    )
