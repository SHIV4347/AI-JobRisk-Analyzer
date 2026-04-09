from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import JobAnalysis
from schemas import AnalyzeJobRequest, AnalyzeJobResponse
from ai_engine import analyze_job_with_ai
import json

router = APIRouter()


@router.post("/analyze-job", response_model=AnalyzeJobResponse)
def analyze_job(request: AnalyzeJobRequest, db: Session = Depends(get_db)):
    """
    Analyze a job role for AI automation risk.

    Steps:
    1. Validate input (handled by Pydantic)
    2. Send to AI engine for analysis
    3. Apply rule-based scoring adjustments (experience, tools, decision-making)
    4. Persist result to PostgreSQL
    5. Return structured JSON response
    """
    try:
        # Step 2 & 3: AI analysis + rule adjustments (all new fields passed in)
        result = analyze_job_with_ai(
            job_title=request.job_title,
            tasks=request.tasks,
            experience_level=request.experience_level,
            tools_used=request.tools_used,
            decision_making=request.decision_making,
        )
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"AI returned malformed JSON: {str(e)}")
    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {type(e).__name__} - {str(e)}")

    # Step 4: Persist to DB (including new columns)
    db_record = JobAnalysis(
        job_title=request.job_title,
        tasks=request.tasks,
        experience_level=request.experience_level,
        tools_used=request.tools_used,
        decision_making=request.decision_making,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        ai_response={
            "task_analysis": result["task_analysis"],
            "recommendations": result["recommendations"],
            "skills_to_learn": result["skills_to_learn"],
            "raw_ai_response": result["raw_ai_response"],
        },
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    # Step 5: Return response
    return AnalyzeJobResponse(
        id=db_record.id,
        job_title=db_record.job_title,
        risk_score=db_record.risk_score,
        risk_level=db_record.risk_level,
        experience_level=db_record.experience_level,
        tools_used=db_record.tools_used or [],
        decision_making=db_record.decision_making,
        task_analysis=result["task_analysis"],
        recommendations=result["recommendations"],
        skills_to_learn=result["skills_to_learn"],
        created_at=db_record.created_at,
    )
