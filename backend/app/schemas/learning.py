from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class UserMetrics(BaseModel):
    total_activities: int
    completed_modules: int
    total_submissions: int
    days_active: int
    max_daily_completions: int
    engagement_score: int
    today_completed_modules: Optional[int] = 0

class TargetUpdateRequest(BaseModel):
    learning_target: str

class BehaviorAnalysis(BaseModel):
    consistency: str
    velocity: str
    engagement_level: str

class TelemetryResponse(BaseModel):
    learning_style: str
    confidence: float
    user_metrics: UserMetrics
    behavior_analysis: BehaviorAnalysis
    generated_at: datetime

class InsightResponse(BaseModel):
    id: int
    insight_text: str
    insight_type: str = "general"
    learning_style: str
    created_at: datetime

    class Config:
        from_attributes = True

class InsightHistoryResponse(BaseModel):
    insights: List[InsightResponse]
    total: int

class RecommendationItem(BaseModel):
    journey_id: int
    name: str
    score: float
    reason: str

class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem]
    generated_at: datetime

class ActivityCreate(BaseModel):
    journey_id: int
    tutorial_id: int
    action: str # 'view', 'complete', 'submit'
    duration_seconds: int = 0

class ActivityResponse(BaseModel):
    id: int
    journey_id: int
    tutorial_id: int
    action: str
    duration_seconds: int
    timestamp: datetime

    class Config:
        from_attributes = True

class SkillItem(BaseModel):
    journey_id: int
    subject: str
    course_name: str
    course_name_en: str
    category: str
    score: int
    full_mark: int = 150
    completed_modules: int = 0
    total_modules: int = 0
    completion_pct: int = 0
    submissions: int = 0

class EvaluationCard(BaseModel):
    title: str
    description: str
    skill_subject: Optional[str] = None
    score: Optional[int] = None
    full_mark: int = 150
    is_mastered: bool = False

class GraduationProjection(BaseModel):
    eta_text: str
    badge: str
    description: str
    remaining_modules: int
    completed_modules: int
    total_modules: int
    days_estimated: int

class SkillMapResponse(BaseModel):
    skills: List[SkillItem]
    strongest: Optional[SkillItem] = None
    weakest: Optional[SkillItem] = None
    has_activity: bool = False
    total_curriculum_modules: int = 21
    completed_curriculum_modules: int = 0
    strength_evaluation: Optional[EvaluationCard] = None
    improvement_evaluation: Optional[EvaluationCard] = None
    graduation_projection: Optional[GraduationProjection] = None
    generated_at: datetime
