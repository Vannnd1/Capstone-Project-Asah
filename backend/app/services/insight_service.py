from datetime import datetime
from typing import Optional
import requests
from app.config import GOOGLE_API_KEY
from app.models.user import User
from app.schemas.learning import InsightResponse, SkillMapResponse, TelemetryResponse


def generate_ai_insight(
    user: User,
    telemetry: TelemetryResponse,
    skill_map: Optional[SkillMapResponse] = None,
    lang: str = "id",
) -> InsightResponse:
    display_name = user.display_name or user.username
    style = telemetry.learning_style
    metrics = telemetry.user_metrics
    target = getattr(user, "learning_target", None) or "fokus"
    is_en = lang == "en"

    target_info = {
        "santai": {
            "label_id": "Santai",
            "label_en": "Relaxed",
            "quota": 1,
            "desc_id": "1 modul/hari",
            "desc_en": "1 module/day",
        },
        "fokus": {
            "label_id": "Fokus",
            "label_en": "Focused",
            "quota": 3,
            "desc_id": "3 modul/hari",
            "desc_en": "3 modules/day",
        },
        "hardcore": {
            "label_id": "Hardcore",
            "label_en": "Hardcore",
            "quota": 5,
            "desc_id": "5+ modul/hari",
            "desc_en": "5+ modules/day",
        },
    }
    cur_target = target_info.get(target, target_info["fokus"])
    today_done = getattr(metrics, "today_completed_modules", 0) or 0
    total_curriculum = skill_map.total_curriculum_modules if skill_map else 21
    completed_curriculum = (
        skill_map.completed_curriculum_modules
        if skill_map
        else metrics.completed_modules
    )

    strongest = skill_map.strongest if skill_map else None
    weakest = skill_map.weakest if skill_map else None
    has_activity = skill_map.has_activity if skill_map else (metrics.completed_modules > 0)

    # Check if Gemini API can be utilized
    if GOOGLE_API_KEY:
        try:
            skill_summary = ""
            if has_activity and strongest and weakest:
                skill_summary = (
                    f"Skill terkuat: {strongest.subject} ({strongest.score}/150, "
                    f"{strongest.completed_modules}/{strongest.total_modules} modul). "
                    f"Area yang perlu ditingkatkan: {weakest.subject} ({weakest.score}/150, "
                    f"{weakest.completed_modules}/{weakest.total_modules} modul)."
                )
            else:
                skill_summary = "Siswa belum menyelesaikan modul apa pun di akun ini."

            lang_instruction = (
                "Respond naturally in English." if is_en else "Jawab secara alami dalam Bahasa Indonesia."
            )
            prompt = (
                f"Kamu adalah AI Learning Insight Coach. Berikan evaluasi dan saran belajar personal "
                f"untuk siswa bernama '{display_name}' (gaya belajar: '{style}', confidence {round(telemetry.confidence * 100)}%). "
                f"Target belajar: '{cur_target['label_id']}' ({cur_target['desc_id']}). "
                f"Progres nyata akun: hari ini menyelesaikan {today_done} dari target {cur_target['quota']} modul, "
                f"total {completed_curriculum}/{total_curriculum} modul kurikulum tuntas, {metrics.days_active} hari aktif, "
                f"{metrics.total_submissions} submission kuis, skor engagement {metrics.engagement_score}. "
                f"{skill_summary} "
                f"Berikan 2-3 kalimat yang akurat, ramah, dan menyebutkan skill terkuat serta fokus perbaikan berikutnya berdasarkan angka nyata di atas. "
                f"{lang_instruction}"
            )

            for model_name in ("gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"):
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={GOOGLE_API_KEY}"
                resp = requests.post(
                    url,
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    timeout=5,
                )
                if resp.status_code == 200:
                    result = resp.json()
                    text = (
                        result.get("candidates", [{}])[0]
                        .get("content", {})
                        .get("parts", [{}])[0]
                        .get("text", "")
                        .strip()
                    )
                    if text:
                        return InsightResponse(
                            id=int(datetime.utcnow().timestamp()),
                            insight_text=text,
                            insight_type="ai_generated",
                            learning_style=style,
                            created_at=datetime.utcnow(),
                        )
        except Exception:
            # Fallback to smart rule-based engine if Gemini call fails
            pass

    # Built-in data-driven narrative engine (ID & EN)
    if not has_activity and metrics.completed_modules == 0:
        if is_en:
            text = (
                f"Welcome, {display_name}! Your account currently has 0/{total_curriculum} completed modules. "
                f"With your {cur_target['label_en']} target ({cur_target['desc_en']}), start with your first module "
                f"in React Core or Cloud & DevOps today so AI can analyze your strengths!"
            )
        else:
            text = (
                f"Selamat datang, {display_name}! Akunmu saat ini memiliki 0/{total_curriculum} modul selesai. "
                f"Dengan target {cur_target['label_id']} ({cur_target['desc_id']}), mulailah dari 1 modul di kelas "
                f"React Core atau Cloud & DevOps hari ini agar AI dapat memetakan profil belajarmu!"
            )
        return InsightResponse(
            id=int(datetime.utcnow().timestamp()),
            insight_text=text,
            insight_type="rule_based",
            learning_style=style,
            created_at=datetime.utcnow(),
        )

    if is_en:
        if today_done >= cur_target["quota"]:
            status_text = f"You have achieved today's target ({today_done}/{cur_target['quota']} modules) with {completed_curriculum}/{total_curriculum} total modules completed. "
        elif today_done > 0:
            status_text = f"Today you completed {today_done}/{cur_target['quota']} modules ({completed_curriculum}/{total_curriculum} total curriculum progress). "
        else:
            status_text = f"You have completed {completed_curriculum}/{total_curriculum} modules overall; aim for {cur_target['quota']} module(s) today ({cur_target['label_en']} mode). "

        skill_advice = ""
        if strongest and weakest:
            if weakest.score >= 120:
                skill_advice = (
                    f"Your strongest domain is {strongest.subject} ({strongest.score}/150) and all skill areas are strong—keep sharp with capstone challenges!"
                )
            else:
                skill_advice = (
                    f"Your strongest skill is {strongest.subject} ({strongest.score}/150), while AI recommends focusing next on "
                    f"{weakest.subject} ({weakest.score}/150) to balance your mastery."
                )

        style_prefix = {
            "fast_learner": f"Outstanding, {display_name}! Your learning pace is remarkably swift. ",
            "consistent_learner": f"Great job, {display_name}! Your study consistency is exceptionally steady. ",
            "reflective_learner": f"Excellent, {display_name}! You absorb concepts thoughtfully and thoroughly. ",
            "passive_learner": f"Keep it up, {display_name}! Steady steps build lasting momentum. ",
        }.get(style, f"Great progress, {display_name}! ")

        text = f"{style_prefix}{status_text}{skill_advice}".strip()
    else:
        if today_done >= cur_target["quota"]:
            status_text = f"Target harianmu ({today_done}/{cur_target['quota']} modul) sudah tercapai dengan total {completed_curriculum}/{total_curriculum} modul kurikulum tuntas. "
        elif today_done > 0:
            status_text = f"Hari ini kamu sudah menyelesaikan {today_done}/{cur_target['quota']} modul (total progres {completed_curriculum}/{total_curriculum} modul). "
        else:
            status_text = f"Total progresmu saat ini {completed_curriculum}/{total_curriculum} modul; selesaikan {cur_target['quota']} modul hari ini sesuai mode {cur_target['label_id']}. "

        skill_advice = ""
        if strongest and weakest:
            if weakest.score >= 120:
                skill_advice = (
                    f"Keunggulan tertinggimu di {strongest.subject} ({strongest.score}/150) dan seluruh bidang sudah di level kuat—lanjutkan dengan proyek nyata!"
                )
            else:
                skill_advice = (
                    f"Keunggulan terkuatmu ada di {strongest.subject} ({strongest.score}/150), dan AI menyarankan fokus berikutnya pada "
                    f"{weakest.subject} ({weakest.score}/150) agar kompetensimu lebih merata."
                )

        style_prefix = {
            "fast_learner": f"Luar biasa, {display_name}! Ritme belajarmu sangat cepat. ",
            "consistent_learner": f"Hebat, {display_name}! Konsistensi belajarmu sangat stabil. ",
            "reflective_learner": f"Bagus sekali, {display_name}! Kamu mempelajari konsep secara mendalam. ",
            "passive_learner": f"Semangat, {display_name}! Langkah kecil yang rutin akan membangun momentum. ",
        }.get(style, f"Progres bagus, {display_name}! ")

        text = f"{style_prefix}{status_text}{skill_advice}".strip()

    return InsightResponse(
        id=int(datetime.utcnow().timestamp()),
        insight_text=text,
        insight_type="rule_based",
        learning_style=style,
        created_at=datetime.utcnow(),
    )
