from datetime import datetime
from typing import Dict, List, Set
from app.models.activity import Activity
from app.schemas.learning import RecommendationItem, RecommendationResponse
from app.services.skill_map_service import CURRICULUM_CATALOG


# Complementary course relationships (journey_id -> next suggested journeys)
COMPLEMENTARY_MAP = {
    101: [105, 103, 106],  # React -> Next.js, Back-End API, UI/UX
    102: [103, 104, 101],  # ML -> Back-End API, Cloud AWS, React
    103: [104, 101, 105],  # Back-End API -> Cloud AWS, React, Next.js
    104: [103, 105, 102],  # Cloud AWS -> Back-End API, Next.js, ML
    105: [103, 104, 106],  # Next.js -> Back-End API, Cloud AWS, UI/UX
    106: [101, 105, 103],  # UI/UX -> React, Next.js, Back-End API
}


def get_course_recommendations(
    user_activities: List[Activity],
    n: int = 5,
    learning_style: str = "fast_learner",
    lang: str = "id",
) -> RecommendationResponse:
    is_en = lang == "en"
    completed_by_journey: Dict[int, Set[int]] = {c["journey_id"]: set() for c in CURRICULUM_CATALOG}

    for act in user_activities:
        if act.action == "complete" and act.journey_id in completed_by_journey:
            completed_by_journey[act.journey_id].add(act.tutorial_id)

    fully_completed_ids = {
        c["journey_id"]
        for c in CURRICULUM_CATALOG
        if len(completed_by_journey[c["journey_id"]]) >= c["total_modules"]
    }

    # Find complementary priority scores from courses user already started or finished
    active_or_done_ids = {
        jid for jid, mods in completed_by_journey.items() if len(mods) > 0
    }
    complementary_boost: Dict[int, float] = {}
    for jid in active_or_done_ids:
        for idx, target_jid in enumerate(COMPLEMENTARY_MAP.get(jid, [])):
            boost = 0.08 - idx * 0.02
            complementary_boost[target_jid] = max(complementary_boost.get(target_jid, 0.0), boost)

    scored_items = []
    for course in CURRICULUM_CATALOG:
        jid = course["journey_id"]
        done_count = min(len(completed_by_journey[jid]), course["total_modules"])
        total_mods = course["total_modules"]
        remaining = total_mods - done_count

        if jid in fully_completed_ids:
            continue

        # Base relevance score
        if done_count > 0:
            # Course already in progress: high priority to finish!
            progress_ratio = done_count / total_mods
            score = round(min(0.86 + progress_ratio * 0.11, 0.98), 2)
            if is_en:
                reason = (
                    f"You've completed {done_count}/{total_mods} modules ({round(progress_ratio * 100)}%). "
                    f"Only {remaining} module(s) left to master {course['subject']}!"
                )
            else:
                reason = (
                    f"Kamu sudah menyelesaikan {done_count}/{total_mods} modul ({round(progress_ratio * 100)}%). "
                    f"Tinggal {remaining} modul lagi untuk menuntaskan {course['subject']}!"
                )
        else:
            # Unstarted course: prioritize filling weakest/complementary domains
            boost = complementary_boost.get(jid, 0.04)
            style_bonus = 0.03 if learning_style == "fast_learner" else 0.01
            score = round(min(0.82 + boost + style_bonus, 0.96), 2)
            if len(active_or_done_ids) == 0:
                if is_en:
                    reason = f"Great starting course to build your {course['subject']} foundation ({total_mods} modules)."
                else:
                    reason = f"Kelas awal yang tepat untuk membangun fondasi {course['subject']} ({total_mods} modul)."
            elif jid in complementary_boost:
                if is_en:
                    reason = (
                        f"Your {course['subject']} score is still 0/150—ideal next step to complement your current track."
                    )
                else:
                    reason = (
                        f"Skor {course['subject']} masih 0/150—langkah tepat untuk melengkapi jalur belajarmu saat ini."
                    )
            else:
                if is_en:
                    reason = f"Recommended to expand your {course['category']} skills ({total_mods} modules)."
                else:
                    reason = f"Direkomendasikan untuk memperluas keahlianmu di bidang {course['category']} ({total_mods} modul)."

        scored_items.append(
            RecommendationItem(
                journey_id=jid,
                name=course["course_name_en"] if is_en else course["course_name"],
                score=score,
                reason=reason,
            )
        )

    # Sort descending by score
    scored_items.sort(key=lambda item: item.score, reverse=True)

    # If user completed ALL 6 courses, show top n for review
    if not scored_items:
        for course in CURRICULUM_CATALOG[:n]:
            scored_items.append(
                RecommendationItem(
                    journey_id=course["journey_id"],
                    name=course["course_name_en"] if is_en else course["course_name"],
                    score=0.95,
                    reason=(
                        "All modules completed! Revisit to keep your mastery sharp."
                        if is_en
                        else "Semua modul sudah tuntas! Ulas kembali untuk menjaga ketajaman pemahaman."
                    ),
                )
            )

    return RecommendationResponse(
        recommendations=scored_items[:n],
        generated_at=datetime.utcnow(),
    )
