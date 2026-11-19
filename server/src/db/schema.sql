-- ====================================================================
-- Sweety - Blood Glucose Tracker Schema (PostgreSQL / Supabase)
-- ====================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables/types if re-running
DROP TABLE IF EXISTS readings;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS meal_slot;

-- Create Enum for the 4 explicit clinical meal slots
CREATE TYPE meal_slot AS ENUM (
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner'
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Readings Table
CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  slot meal_slot NOT NULL,
  value INT NOT NULL CHECK (value >= 40 AND value <= 600),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_date_slot UNIQUE (user_id, reading_date, slot),
  CONSTRAINT chk_not_future_date CHECK (reading_date <= CURRENT_DATE)
);

-- Indexes for optimal performance
CREATE INDEX idx_readings_user_date ON readings (user_id, reading_date DESC);
CREATE INDEX idx_readings_user_created ON readings (user_id, created_at DESC);
