from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.activity import Activity
from app.models.insight import Insight
from app.schemas.learning import (
    TelemetryResponse,
    InsightResponse,
    InsightHistoryResponse,
    RecommendationResponse,
    ActivityCreate,
    ActivityResponse,
    TargetUpdateRequest,
)
from app.services.auth_service import get_current_user
from app.services.ml_service import calculate_user_telemetry
from app.services.recommender import get_course_recommendations
from app.services.insight_service import generate_ai_insight

router = APIRouter(prefix="/api/learning", tags=["Learning"])

@router.get("/telemetry", response_model=TelemetryResponse)
def get_telemetry(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
    return calculate_user_telemetry(activities)

@router.get("/insight", response_model=InsightResponse)
def get_insight(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
    telemetry = calculate_user_telemetry(activities)
    new_insight = generate_ai_insight(current_user, telemetry)

    # Persist insight to DB
    db_insight = Insight(
        user_id=current_user.id,
        insight_text=new_insight.insight_text,
        insight_type=new_insight.insight_type,
        learning_style=new_insight.learning_style
    )
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)

    return InsightResponse.model_validate(db_insight)

@router.get("/insight/history", response_model=InsightHistoryResponse)
def get_insight_history(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Insight).filter(Insight.user_id == current_user.id).order_by(Insight.created_at.desc())
    total = query.count()
    insights = query.offset(offset).limit(limit).all()

    # If no history yet, generate first insight
    if total == 0:
        activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
        telemetry = calculate_user_telemetry(activities)
        first_insight = generate_ai_insight(current_user, telemetry)
        db_insight = Insight(
            user_id=current_user.id,
            insight_text=first_insight.insight_text,
            insight_type=first_insight.insight_type,
            learning_style=first_insight.learning_style
        )
        db.add(db_insight)
        db.commit()
        db.refresh(db_insight)
        return InsightHistoryResponse(
            insights=[InsightResponse.model_validate(db_insight)],
            total=1
        )

    return InsightHistoryResponse(
        insights=[InsightResponse.model_validate(i) for i in insights],
        total=total
    )

@router.get("/recommendation", response_model=RecommendationResponse)
def get_recommendations(
    n: int = Query(5, ge=1, le=20),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
    return get_course_recommendations(activities, n)

@router.post("/activity", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def log_activity(
    activity_data: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_act = Activity(
        user_id=current_user.id,
        journey_id=activity_data.journey_id,
        tutorial_id=activity_data.tutorial_id,
        action=activity_data.action,
        duration_seconds=activity_data.duration_seconds
    )
    db.add(new_act)
    db.commit()
    db.refresh(new_act)
    return ActivityResponse.model_validate(new_act)

@router.get("/activity", response_model=List[ActivityResponse])
def get_activities(
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activities = db.query(Activity).filter(
        Activity.user_id == current_user.id
    ).order_by(Activity.timestamp.desc()).limit(limit).all()
    return [ActivityResponse.model_validate(a) for a in activities]

@router.put("/target")
def update_target(
    target_data: TargetUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.learning_target = target_data.learning_target
    db.commit()
    db.refresh(current_user)
    return {"status": "success", "learning_target": current_user.learning_target}
