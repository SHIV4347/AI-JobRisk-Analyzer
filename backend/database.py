import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load env variables (override system variables)
load_dotenv(override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback for local development
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:password@localhost:5432/ai_job_analyzer"

print(f"DEBUG: DATABASE_URL (masked): {DATABASE_URL.split(':')[0]}:***@{DATABASE_URL.split('@')[-1]}")

# Handle SSL automatically for PostgreSQL (e.g., Neon/Railway)
connect_args = {}
if DATABASE_URL and "postgresql" in DATABASE_URL:
    # Ensure sslmode is present for cloud providers
    connect_args["sslmode"] = "require"
    # Some older drivers might need different keys, but sslmode is standard for psycopg2

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,   # Test connection before use (fixes SSL drops)
    pool_recycle=300,     # Recycle connections every 5 mins (Neon closes idle ones)
    pool_size=5,          # Maintain a small pool
    max_overflow=10,      # Allow some burstiness
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
