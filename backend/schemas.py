from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class AnalyzeJobRequest(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=200, description="Job title to analyze")
    tasks: List[str] = Field(..., min_items=1, max_items=20, description="List of daily tasks")
    experience_level: str = Field(..., description="Years of experience: '0-2', '3-5', '5-10', '10+'")
    tools_used: List[str] = Field(default=[], description="Tools used in the role (e.g. Excel, Python, AI tools)")
    decision_making: str = Field(..., description="Decision-making autonomy: 'Low', 'Medium', 'High'")


class TaskAnalysis(BaseModel):
    task: str
    category: str  # repetitive | creative | human_interaction
    replaceability: str  # High | Medium | Low
    risk_score: int


class AnalyzeJobResponse(BaseModel):
    id: int
    job_title: str
    risk_score: int
    risk_level: str
    experience_level: str
    tools_used: List[str]
    decision_making: str
    task_analysis: List[TaskAnalysis]
    recommendations: List[str]
    skills_to_learn: List[str]
    created_at: datetime

    class Config:
        from_attributes = True
