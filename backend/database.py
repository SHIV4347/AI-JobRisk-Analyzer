import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load env variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback for local development
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:password@localhost:5432/ai_job_analyzer"

# Handle Railway SSL automatically
connect_args = {}
if "railway" in DATABASE_URL or "sslmode" not in DATABASE_URL:
    connect_args = {"sslmode": "require"}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

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
