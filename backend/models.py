from sqlalchemy import Column, Integer, Text, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from database import Base


class JobAnalysis(Base):
    __tablename__ = "job_analysis"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(Text, nullable=False)
    tasks = Column(JSONB, nullable=False)
    experience_level = Column(Text, nullable=True)
    tools_used = Column(JSONB, nullable=True)
    decision_making = Column(Text, nullable=True)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(Text, nullable=False)
    ai_response = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
