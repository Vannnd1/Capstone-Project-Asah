from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    insight_text = Column(Text, nullable=False)
    insight_type = Column(String(50), default="general")
    learning_style = Column(String(50), default="fast_learner")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="insights")
