-- ============================================================
-- AI Job Risk Analyzer — Database Schema (v2)
-- ============================================================

-- 1. Create the database (run once)
CREATE DATABASE ai_job_analyzer;

-- 2. Connect to it
\c ai_job_analyzer

-- 3. Create table with all columns (fresh install)
CREATE TABLE IF NOT EXISTS job_analysis (
    id               SERIAL PRIMARY KEY,
    job_title        TEXT    NOT NULL,
    tasks            JSONB   NOT NULL,
    experience_level TEXT,
    tools_used       JSONB,
    decision_making  TEXT,
    risk_score       INTEGER NOT NULL,
    risk_level       TEXT    NOT NULL,
    ai_response      JSONB   NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MIGRATION — run these if the table already exists (v1 → v2)
-- ============================================================

ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS tools_used       JSONB;
ALTER TABLE job_analysis ADD COLUMN IF NOT EXISTS decision_making  TEXT;

-- 4. Verify
SELECT * FROM job_analysis LIMIT 5;
