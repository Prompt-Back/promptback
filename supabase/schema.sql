-- PromptLens Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Analyses table - stores all website analyses
CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_type TEXT NOT NULL CHECK (input_type IN ('url', 'description')),
  input_value TEXT NOT NULL,
  core_intent_prompt TEXT NOT NULL,
  ui_system_prompt TEXT NOT NULL,
  component_prompts JSONB NOT NULL DEFAULT '{}',
  style_dna TEXT[] NOT NULL DEFAULT '{}',
  assumptions TEXT NOT NULL,
  confidence_level TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  
  -- Search optimization
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', input_value || ' ' || core_intent_prompt || ' ' || COALESCE(array_to_string(style_dna, ' '), ''))
  ) STORED
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS analyses_search_idx ON analyses USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses (user_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses (created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_is_public_idx ON analyses (is_public) WHERE is_public = true;

-- Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own analyses
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own analyses
CREATE POLICY "Users can insert own analyses" ON analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own analyses
CREATE POLICY "Users can update own analyses" ON analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own analyses
CREATE POLICY "Users can delete own analyses" ON analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Anyone can view public analyses
CREATE POLICY "Anyone can view public analyses" ON analyses
  FOR SELECT
  USING (is_public = true);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(analysis_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE analyses
  SET view_count = view_count + 1
  WHERE id = analysis_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- API usage tracking table
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS api_usage_user_id_idx ON api_usage (user_id);
CREATE INDEX IF NOT EXISTS api_usage_created_at_idx ON api_usage (created_at DESC);

-- RLS for api_usage
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own api usage" ON api_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert api usage" ON api_usage
  FOR INSERT
  WITH CHECK (true);
