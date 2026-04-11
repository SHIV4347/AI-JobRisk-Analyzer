from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import engine, Base
from routes.analyze import router as analyze_router

# Initialize database tables
try:
    print("DEBUG: Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("DEBUG: Database tables created successfully.")
except Exception as e:
    print(f"CRITICAL: Database initialization failed: {e}")
    # We continue so health checks can still run and we can see logs

# Apply schema updates safely on startup
_MIGRATIONS = [
    "ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS experience_level TEXT;",
    "ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS tools_used JSONB;",
    "ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS decision_making TEXT;",
]

try:
    with engine.connect() as conn:
        for stmt in _MIGRATIONS:
            conn.execute(text(stmt))
        conn.commit()
except Exception as e:
    print(f"Database migration warning: {e}")

app = FastAPI(
    title="AI Job Risk Analyzer",
    description="Analyze the likelihood of your job being automated by AI.",
    version="1.0.0",
)

import os

# CORS Settings
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api", tags=["Analysis"])

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "AI Job Risk Analyzer API is running."}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
