"""
One-time migration script: adds new columns to the job_analysis table.
Run from: c:\Projects\AI-Job-Analyzer\backend
Usage:    python migrate.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import engine
from sqlalchemy import text

MIGRATIONS = [
    "ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS experience_level TEXT;",
    "ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS tools_used JSONB;",
    "ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS decision_making TEXT;",
]

def run():
    with engine.connect() as conn:
        for sql in MIGRATIONS:
            print(f"Running: {sql}")
            conn.execute(text(sql))
        conn.commit()
    print("\n✅ Migration complete. New columns added.")

if __name__ == "__main__":
    run()
