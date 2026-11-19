from datetime import datetime
from typing import List
from app.models.activity import Activity
from app.schemas.learning import RecommendationItem, RecommendationResponse

CATALOG = [
    {
        "journey_id": 101,
        "name": "Menjadi React Developer Expert",
        "score": 0.96,
        "reason": "Berdasarkan ketertarikan pada modul Frontend & React"
    },
    {
        "journey_id": 102,
        "name": "Belajar Dasar Machine Learning",
        "score": 0.91,
        "reason": "Populer di kalangan siswa Fast Learner"
    },
    {
        "journey_id": 103,
        "name": "Membangun Back-End dengan Node.js",
        "score": 0.85,
        "reason": "Direkomendasikan untuk melengkapi keahlian Full-Stack"
    },
    {
        "journey_id": 104,
        "name": "Cloud Practitioner Essentials (AWS)",
        "score": 0.80,
        "reason": "Skill pelengkap arsitektur cloud"
    },
    {
        "journey_id": 105,
        "name": "Pengembangan Web dengan Next.js",
        "score": 0.78,
        "reason": "Kelanjutan setelah menguasai React modern"
    }
]

def get_course_recommendations(user_activities: List[Activity], n: int = 5) -> RecommendationResponse:
    # Filter or reorder based on courses already taken
    completed_ids = set(a.journey_id for a in user_activities if a.action == "complete")
    
    recommendations = []
    for item in CATALOG:
        # Don't recommend completed courses, or keep score high for new courses
        score = item["score"]
        if item["journey_id"] in completed_ids:
            continue
        recommendations.append(RecommendationItem(
            journey_id=item["journey_id"],
            name=item["name"],
            score=score,
            reason=item["reason"]
        ))
        if len(recommendations) >= n:
            break

    # If all courses completed or catalog small, return top n from CATALOG
    if not recommendations:
        recommendations = [
            RecommendationItem(**item) for item in CATALOG[:n]
        ]

    return RecommendationResponse(
        recommendations=recommendations,
        generated_at=datetime.utcnow()
    )
