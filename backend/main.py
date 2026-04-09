from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import engine, Base
from routes.analyze import router as analyze_router

# Create all tables on startup (new installs)
Base.metadata.create_all(bind=engine)

# ── Inline migration: safely add new columns if they don't exist ──────────────
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
    print("✅ DB migration complete (new columns ready).")
except Exception as _e:
    print(f"⚠️  DB migration warning: {_e}")
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="AI Job Risk Analyzer",
    description="Analyze the likelihood of your job being automated by AI.",
    version="1.0.0",
)

# CORS – allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
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
