from datetime import datetime
from typing import Dict, List, Tuple
from app.models.activity import Activity
from app.schemas.learning import TelemetryResponse, UserMetrics, BehaviorAnalysis


def calculate_user_telemetry(activities: List[Activity]) -> TelemetryResponse:
    total_acts = len(activities)

    if total_acts == 0:
        return TelemetryResponse(
            learning_style="passive_learner",
            confidence=0.65,
            user_metrics=UserMetrics(
                total_activities=0,
                completed_modules=0,
                total_submissions=0,
                days_active=0,
                max_daily_completions=0,
                engagement_score=0,
                today_completed_modules=0,
            ),
            behavior_analysis=BehaviorAnalysis(
                consistency="moderate",
                velocity="moderate",
                engagement_level="developing",
            ),
            generated_at=datetime.utcnow(),
        )

    # Deduplicate unique completed modules by (journey_id, tutorial_id), keeping latest timestamp
    unique_completed: Dict[Tuple[int, int], Activity] = {}
    for a in activities:
        if a.action == "complete":
            key = (a.journey_id, a.tutorial_id)
            if key not in unique_completed or (
                a.timestamp and unique_completed[key].timestamp and a.timestamp > unique_completed[key].timestamp
            ):
                unique_completed[key] = a

    completed_modules = len(unique_completed)
    unique_submissions = set(
        (a.journey_id, a.tutorial_id) for a in activities if a.action == "submit"
    )
    total_submissions = len(unique_submissions)

    today_date = datetime.utcnow().date()
    today_completed_modules = sum(
        1 for a in unique_completed.values() if a.timestamp and a.timestamp.date() == today_date
    )

    # Calculate days active from unique activity dates
    dates = set(a.timestamp.date() for a in activities if a.timestamp)
    days_active = max(len(dates), 1)

    # Max unique completions in a single day
    day_counts: Dict[str, int] = {}
    for a in unique_completed.values():
        if a.timestamp:
            d_str = a.timestamp.strftime("%Y-%m-%d")
            day_counts[d_str] = day_counts.get(d_str, 0) + 1
    max_daily_completions = max(day_counts.values()) if day_counts else 0

    # Calculate engagement score (0 - 250)
    engagement_score = min(total_acts * 2 + completed_modules * 5 + total_submissions * 4, 250)

    # Determine behavior metrics
    avg_daily_completions = completed_modules / max(days_active, 1)
    if max_daily_completions >= 4 or avg_daily_completions >= 2.0:
        velocity = "very_fast"
    elif avg_daily_completions >= 1.0:
        velocity = "fast"
    else:
        velocity = "moderate"

    if days_active >= 5 or total_acts >= 20:
        consistency = "very_high"
    elif days_active >= 3:
        consistency = "high"
    else:
        consistency = "moderate"

    if engagement_score >= 80:
        engagement_level = "excellent"
    elif engagement_score >= 40:
        engagement_level = "good"
    else:
        engagement_level = "developing"

    # Learning style classification
    if velocity in ("very_fast", "fast") and consistency in ("very_high", "high") and completed_modules >= 3:
        learning_style = "fast_learner"
        confidence = 0.89 if avg_daily_completions >= 1.5 else 0.86
    elif consistency in ("very_high", "high") and completed_modules >= 2:
        learning_style = "consistent_learner"
        confidence = 0.85
    elif completed_modules > 0:
        learning_style = "reflective_learner"
        confidence = 0.82
    else:
        learning_style = "passive_learner"
        confidence = 0.76

    metrics = UserMetrics(
        total_activities=total_acts,
        completed_modules=completed_modules,
        total_submissions=total_submissions,
        days_active=days_active,
        max_daily_completions=max_daily_completions,
        engagement_score=engagement_score,
        today_completed_modules=today_completed_modules,
    )

    behavior = BehaviorAnalysis(
        consistency=consistency,
        velocity=velocity,
        engagement_level=engagement_level,
    )

    return TelemetryResponse(
        learning_style=learning_style,
        confidence=confidence,
        user_metrics=metrics,
        behavior_analysis=behavior,
        generated_at=datetime.utcnow(),
    )
