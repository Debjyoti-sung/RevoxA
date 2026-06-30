-- RevoxA PostgreSQL Database Schema
-- Compatible with Supabase PostgreSQL and pgvector

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'Growth',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    role VARCHAR(50) DEFAULT 'Analyst',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workspace Members Table
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'Viewer',
    PRIMARY KEY (workspace_id, profile_id)
);

-- Feedback Sources
CREATE TABLE IF NOT EXISTS feedback_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., 'gmail', 'slack', 'discord', 'zendesk'
    connection_status VARCHAR(50) DEFAULT 'active',
    last_sync TIMESTAMP WITH TIME ZONE,
    records_synced INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Clusters
CREATE TABLE IF NOT EXISTS feedback_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    summary TEXT,
    growth_rate DECIMAL(5,2) DEFAULT 0.00,
    trend VARCHAR(50) DEFAULT 'stable', -- 'rising', 'declining', 'stable'
    sentiment_score DECIMAL(3,2) DEFAULT 0.00, -- range: -1.00 to 1.00
    total_feedback_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Items Table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    source_id UUID REFERENCES feedback_sources(id) ON DELETE SET NULL,
    title TEXT,
    content TEXT NOT NULL,
    source_type VARCHAR(100) NOT NULL, -- 'gmail', 'slack', 'discord', 'reddit', 'twitter', 'csv', 'zendesk'
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    sentiment VARCHAR(50) DEFAULT 'neutral', -- 'positive', 'negative', 'neutral'
    sentiment_score DECIMAL(3,2) DEFAULT 0.00,
    severity VARCHAR(50) DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'processed', 'ignored'
    cluster_id UUID REFERENCES feedback_clusters(id) ON DELETE SET NULL,
    feature_tag VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Embeddings (pgvector)
CREATE TABLE IF NOT EXISTS feedback_embeddings (
    feedback_id UUID PRIMARY KEY REFERENCES feedback(id) ON DELETE CASCADE,
    embedding VECTOR(384) NOT NULL -- BGE Small / Nomic Embed (384/768 dimensions)
);

-- Sentiment Analysis Logs
CREATE TABLE IF NOT EXISTS sentiment_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID REFERENCES feedback(id) ON DELETE CASCADE,
    positive_score DECIMAL(3,2) NOT NULL,
    neutral_score DECIMAL(3,2) NOT NULL,
    negative_score DECIMAL(3,2) NOT NULL,
    detected_emotions JSONB,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feature Requests Table
CREATE TABLE IF NOT EXISTS feature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    summary TEXT,
    popularity_score INTEGER DEFAULT 0,
    growth_rate DECIMAL(5,2) DEFAULT 0.00,
    priority VARCHAR(50) DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Critical'
    revenue_impact_est DECIMAL(12,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Backlog', -- 'Backlog', 'Planned', 'In Progress', 'Completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Issue Tracking Table
CREATE TABLE IF NOT EXISTS issue_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES feedback_clusters(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Open', -- 'Open', 'Investigating', 'In Progress', 'Resolved', 'Closed'
    priority VARCHAR(50) DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Critical'
    assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Insights Table
CREATE TABLE IF NOT EXISTS insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general', -- 'trend', 'anomaly', 'retention', 'ux'
    confidence_score DECIMAL(3,2) DEFAULT 0.00,
    reasoning_trace JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    business_impact VARCHAR(255),
    affected_users INTEGER DEFAULT 0,
    revenue_risk DECIMAL(12,2) DEFAULT 0.00,
    confidence DECIMAL(3,2) DEFAULT 0.00,
    suggested_action TEXT,
    priority VARCHAR(50) DEFAULT 'Medium', -- 'Critical', 'High', 'Medium', 'Low'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports Center
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Weekly', 'Monthly', 'Quarterly', 'Executive', 'Investor'
    content JSONB,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Realtime Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system', -- 'ai', 'issue', 'trend', 'system'
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workspace Activity
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API Keys Management
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_prefix VARCHAR(16) NOT NULL,
    hashed_key VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Settings
CREATE TABLE IF NOT EXISTS settings (
    workspace_id UUID PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
    ai_model VARCHAR(100) DEFAULT 'openai/gpt-oss-120b',
    embedding_model VARCHAR(100) DEFAULT 'nomic-embed',
    memory_retention_days INTEGER DEFAULT 365,
    notification_preferences JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Memory timelines
CREATE TABLE IF NOT EXISTS memory_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_title VARCHAR(255) NOT NULL,
    event_description TEXT,
    event_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Conversations / Copilot Chat
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Memory Banks
CREATE TABLE IF NOT EXISTS memory_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) DEFAULT 'default',
    total_memories INTEGER DEFAULT 0,
    retention_rate DECIMAL(5,2) DEFAULT 100.00,
    last_reflected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mental Models
CREATE TABLE IF NOT EXISTS mental_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    summary TEXT,
    memory_coverage_pct DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create relevant indexes
CREATE INDEX IF NOT EXISTS idx_feedback_workspace ON feedback(workspace_id);
CREATE INDEX IF NOT EXISTS idx_feedback_cluster ON feedback(cluster_id);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX IF NOT EXISTS idx_feature_status ON feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issue_tracking(status);
