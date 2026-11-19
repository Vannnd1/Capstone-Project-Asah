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
