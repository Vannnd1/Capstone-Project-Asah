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
    target = getattr(user, "learning_target", None) or "fokus"

    target_info = {
        "santai": {"label": "Santai", "quota": 1, "desc": "1 modul/hari"},
        "fokus": {"label": "Fokus", "quota": 3, "desc": "3 modul/hari"},
        "hardcore": {"label": "Hardcore", "quota": 5, "desc": "5+ modul/hari"},
    }
    cur_target = target_info.get(target, target_info["fokus"])
    today_done = getattr(metrics, "today_completed_modules", 0)

    # Check if Gemini API can be utilized
    if GOOGLE_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GOOGLE_API_KEY}"
            prompt = (
                f"Kamu adalah AI Learning Insight Coach. Berikan kalimat evaluasi dan motivasi belajar personal "
                f"untuk siswa bernama '{display_name}' yang teridentifikasi sebagai gaya belajar '{style}'. "
                f"Siswa menetapkan target belajar '{cur_target['label']}' ({cur_target['desc']}). "
                f"Progres belajar: hari ini menyelesaikan {today_done} dari target {cur_target['quota']} modul, "
                f"total {metrics.completed_modules} modul selesai, skor engagement {metrics.engagement_score}. "
                f"Berikan saran spesifik yang mengaitkan progres hariannya dengan target belajarnya. "
                f"Buat maksimal 2 kalimat ramah dan memotivasi dalam Bahasa Indonesia."
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
    if today_done >= cur_target["quota"]:
        status_text = f"Target harianmu ({cur_target['quota']} modul) sudah tercapai hari ini! "
    elif today_done > 0:
        status_text = f"Hari ini kamu sudah menyelesaikan {today_done}/{cur_target['quota']} modul. Sedikit lagi menuju target harian! "
    else:
        status_text = f"Target belajarmu adalah mode {cur_target['label']} ({cur_target['desc']}). "

    if style == "fast_learner":
        text = (
            f"Luar biasa, {display_name}! Ritme belajarmu sangat cepat. "
            f"{status_text}Tantang dirimu dengan mini project untuk memperdalam pemahaman praktis!"
        )
    elif style == "consistent_learner":
        text = (
            f"Hebat, {display_name}! Konsistensi belajarmu sangat stabil. "
            f"{status_text}Pertahankan kebiasaan produktif ini untuk mencapai target mingguanmu secara teratur."
        )
    elif style == "reflective_learner":
        text = (
            f"Bagus sekali, {display_name}! Kamu mempelajari setiap konsep secara mendalam. "
            f"{status_text}Eksplorasi modul lanjutan saat kamu merasa sudah menguasai konsep dasarnya."
        )
    else:
        text = (
            f"Semangat, {display_name}! {status_text}"
            f"Langkah kecil yang konsisten akan membangun momentum belajar yang luar biasa!"
        )

    return InsightResponse(
        id=int(datetime.utcnow().timestamp()),
        insight_text=text,
        insight_type="rule_based",
        learning_style=style,
        created_at=datetime.utcnow()
    )
