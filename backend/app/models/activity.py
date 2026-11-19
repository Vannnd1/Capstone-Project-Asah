from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    journey_id = Column(Integer, nullable=False)
    tutorial_id = Column(Integer, nullable=False)
    action = Column(String(50), nullable=False) # 'view', 'complete', 'submit'
    duration_seconds = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activities")
