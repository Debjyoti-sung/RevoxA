import os
import json
import random
from datetime import datetime, timedelta, timezone

def generate_seed_data():
    # 1. MENTAL MODELS
    models = [
        {
            "id": "model-1",
            "name": "Payment Issues",
            "summary": "Reflects checkout friction, credit card declines, PayPal gateway timeouts, subscription renew failures, and Stripe integration bugs.",
            "memory_coverage": 92.5,
            "last_updated": "2026-06-14T20:30:00Z"
        },
        {
            "id": "model-2",
            "name": "Customer Pain Points",
            "summary": "Tracks onboarding hurdles, lack of documentation, slow response times on support channels, and difficulties with custom dashboard configurations.",
            "memory_coverage": 88.0,
            "last_updated": "2026-06-13T18:15:00Z"
        },
        {
            "id": "model-3",
            "name": "Feature Requests",
            "summary": "Consolidates requests for dark mode, mobile applications, multi-workspace support, API webhooks, and deeper Hubspot syncing workflows.",
            "memory_coverage": 76.4,
            "last_updated": "2026-06-14T11:45:00Z"
        },
        {
            "id": "model-4",
            "name": "Product Bugs",
            "summary": "Aggregates reportings of active sessions expiring prematurely, page crashes on heavy Recharts layouts, and CSV export file formatting errors.",
            "memory_coverage": 84.2,
            "last_updated": "2026-06-14T21:10:00Z"
        },
        {
            "id": "model-5",
            "name": "Onboarding Friction",
            "summary": "Identifies drops in user activation due to excessive setup steps, email validation bugs, and initial workspace invitation failures.",
            "memory_coverage": 91.0,
            "last_updated": "2026-06-12T09:00:00Z"
        }
    ]

    # 2. CLUSTERS (50 Clusters)
    top_cluster_names = [
        "Stripe Checkout Gateway Timeout",
        "Workspace Invitation Links Expiring",
        "Slack Notification Webhook Delay",
        "CSV feedback parsing failure",
        "Gmail Authentication JWT Expiry",
        "Slow Recharts Dashboard rendering",
        "Dark Mode visibility contrast",
        "Zendesk ticket synchronization lag",
        "Discord Bot message scraping limit",
        "Reddit subreddit ingestion throttle",
        "Billing currency mismatch",
        "PDF Executive report downloads failing",
        "Hubspot integration CRM mapping error",
        "Intercom chat transcript loss",
        "API rate limits on free tier",
        "Android app login fingerprint crash",
        "iOS push notifications silent fail",
        "Member permissions role sync lag",
        "Two-factor auth SMS code delay",
        "Audit logs download structure error"
    ]

    clusters = []
    now = datetime.now(timezone.utc)
    
    # Set a fixed seed to make generation deterministic
    random.seed(42)
    
    for index in range(50):
        is_top = index < len(top_cluster_names)
        name = top_cluster_names[index] if is_top else f"Semantic Cluster Group #{index + 1}"
        total_feedback_count = random.randint(120, 199) if is_top else random.randint(10, 49)
        growth_rate = round(random.random() * 45 * (1 if random.random() > 0.4 else -0.5), 2)
        sentiment_score = round(random.random() * 1.6 - 0.8, 2)
        
        trend = 'stable'
        if growth_rate > 15:
            trend = 'rising'
        elif growth_rate < -10:
            trend = 'declining'
            
        last_updated = (now - timedelta(hours=index * 2)).isoformat().replace("+00:00", "Z")
        
        clusters.append({
            "id": f"cluster-{index + 1}",
            "name": name,
            "summary": f"Automatically clustered feedback items referencing {name.lower()}. Core sentiment shows users are {'frustrated' if sentiment_score < -0.2 else 'pleased' if sentiment_score > 0.2 else 'indifferent'} regarding this behavior.",
            "growth_rate": growth_rate,
            "trend": trend,
            "sentiment_score": sentiment_score,
            "total_feedback_count": total_feedback_count,
            "last_updated": last_updated
        })

    # 3. FEATURE REQUESTS (100 Features)
    top_features = [
        "Real-time Slack Alerts Integration",
        "Advanced pgvector Semantic Search Filter",
        "Multi-workspace Admin Console",
        "Comprehensive PDF/CSV Report Scheduler",
        "HubSpot Two-way CRM Contact Sync",
        "Direct Zendesk Ticket AI Auto-Responder",
        "Mobile Dashboard (iOS & Android Native)",
        "Full Dark Mode Toggle Options",
        "Interactive Memory Graph Node Editing",
        "API Key Generation & Rate Limiting Dashboard"
    ]

    features = []
    priorities = ['Low', 'Medium', 'High', 'Critical']
    statuses = ['Backlog', 'Planned', 'In Progress', 'Completed']

    for index in range(100):
        is_top = index < len(top_features)
        name = top_features[index] if is_top else f"Product Feature Enhancement Option #{index + 1}"
        popularity_score = random.randint(200, 349) if is_top else random.randint(10, 99)
        growth_rate = round(random.random() * 60, 2)
        priority = priorities[random.randint(2, 3)] if is_top else priorities[random.randint(0, 2)]
        revenue_impact = popularity_score * (random.randint(50, 199))
        status = statuses[random.randint(0, 3)]
        created_at = (now - timedelta(days=index * 2.5)).isoformat().replace("+00:00", "Z")

        features.append({
            "id": f"feature-{index + 1}",
            "name": name,
            "summary": f"Suggested product enhancement: {name.lower()}. Initiated by multiple customer requests and analyzed via vector memory systems.",
            "popularity_score": popularity_score,
            "growth_rate": growth_rate,
            "priority": priority,
            "revenue_impact": revenue_impact,
            "status": status,
            "created_at": created_at
        })

    # 4. RECOMMENDATIONS
    recommendations = [
        {
            "id": "rec-1",
            "title": "Upgrade Stripe Webhook Concurrency Limits",
            "description": "Memory recall shows checkout timeouts peaked during European business hours. Increase API handler workers to prevent gateway dropouts.",
            "business_impact": "Reduce cart abandonment and secure pending subscriptions.",
            "affected_users": 1420,
            "revenue_risk": 42000,
            "confidence": 96,
            "suggested_action": "Edit `services/stripe.py` thread-pool config and check AWS server limits.",
            "priority": "Critical",
            "created_at": now.isoformat().replace("+00:00", "Z")
        },
        {
            "id": "rec-2",
            "title": "Redesign Workspace Member Invitation Flow",
            "description": "Reflection analysis highlights 42 complaints regarding expired verification tokens. Change token duration from 2 hours to 24 hours.",
            "business_impact": "Boost workspace activation rate by 14.5% MoM.",
            "affected_users": 840,
            "revenue_risk": 18500,
            "confidence": 91,
            "suggested_action": "Update Supabase JWT expiration hook in invite handler.",
            "priority": "High",
            "created_at": (now - timedelta(days=1)).isoformat().replace("+00:00", "Z")
        },
        {
            "id": "rec-3",
            "title": "Build Slack Alerts Notification Toggle",
            "description": "Ingestion trends reveal high demand for real-time notifications when new Critical feedback arrives.",
            "business_impact": "Reduce customer support SLA times from 4 hours to 15 minutes.",
            "affected_users": 2150,
            "revenue_risk": 12000,
            "confidence": 88,
            "suggested_action": "Leverage Slack incoming webhooks and deploy message dispatcher.",
            "priority": "Medium",
            "created_at": (now - timedelta(days=2)).isoformat().replace("+00:00", "Z")
        },
        {
            "id": "rec-4",
            "title": "Fix Chart Legend Contrast in Light Theme",
            "description": "Several customers on Twitter reported text formatting difficulties in the Executive PDF exports on laptops.",
            "business_impact": "Improve accessibility scores (WCAG AA).",
            "affected_users": 320,
            "revenue_risk": 3500,
            "confidence": 94,
            "suggested_action": "Override chart typography color styles to Deep Slate (#1E2433).",
            "priority": "Low",
            "created_at": (now - timedelta(days=3)).isoformat().replace("+00:00", "Z")
        }
    ]

    # 5. FEEDBACK ITEMS (100 Items)
    samples = [
        {
            "title": "Subscription renew failing with error code 402",
            "content": "I've been trying to renew our corporate plan for the last 3 days using our corporate Visa. The checkout page keeps spinning and eventually throws a Stripe timeout error code 402. We need this sorted ASAP as our team is locked out of dashboard controls.",
            "source_type": "gmail",
            "name": "Clara Vance",
            "email": "clara.v@company.com",
            "sentiment": "negative",
            "severity": "critical",
            "feature": "Billing"
        },
        {
            "title": "Onboarding flow is incredibly confusing",
            "content": "Just signed up for RevoxA and I'm totally lost. The workspace invite email was expired when my developer clicked it. Then we couldn't figure out how to import the CSV file because the template page kept returning a 500 server error. Documentation is sparse.",
            "source_type": "zendesk",
            "name": "Mark Harrison",
            "email": "mharrison@techcorp.io",
            "sentiment": "negative",
            "severity": "high",
            "feature": "Onboarding"
        },
        {
            "title": "Slack notifications lag by 30 mins",
            "content": "The webhook integrations are useful but we noticed that Slack alerts for new customer issues are delayed by 25 to 30 minutes. Real-time updates should actually be real-time, otherwise we check the dashboard manually anyway.",
            "source_type": "slack",
            "name": "Dev Team",
            "email": "devops@chatlabs.com",
            "sentiment": "neutral",
            "severity": "medium",
            "feature": "Integrations"
        },
        {
            "title": "Love the new memory graph feature!",
            "content": "The React Flow Memory Graph is absolutely incredible! We can easily trace feedback items directly to our release schedules and pinpoint feature requests. This is a game-changer for product sprint planning.",
            "source_type": "discord",
            "name": "Alex Rivera",
            "email": "alex@indiedev.org",
            "sentiment": "positive",
            "severity": "low",
            "feature": "Analytics"
        },
        {
            "title": "Cannot download PDF executive reports",
            "content": "Whenever I click 'Generate Report' and select PDF format, the loading icon spins forever. Eventually, the browser says the network connection timed out. CSV export works fine, but we need PDF for our board meetings.",
            "source_type": "hubspot",
            "name": "Sarah Jenkins",
            "email": "s.jenkins@investpartners.com",
            "sentiment": "negative",
            "severity": "high",
            "feature": "Reporting"
        }
    ]

    feedbacks = []
    source_types = ['gmail', 'slack', 'discord', 'reddit', 'twitter', 'csv', 'zendesk', 'hubspot', 'intercom']
    sentiments = ['positive', 'negative', 'neutral']
    severities = ['low', 'medium', 'high', 'critical']
    statuses_list = ['new', 'processed', 'ignored']
    features_list = ['Billing', 'Onboarding', 'Integrations', 'Reporting', 'UI UX', 'API']

    for index in range(100):
        sample = samples[index % len(samples)]
        
        source_type = sample["source_type"] if index < len(samples) else source_types[index % len(source_types)]
        title = sample["title"] if index < len(samples) else f"Feedback report regarding {clusters[index % 50]['name']}"
        content = sample["content"] if index < len(samples) else f"Feedback comment submitted by client. The main theme is related to {clusters[index % 50]['name'].lower()} and they would like this resolved quickly. Interface performance is crucial."
        customer_name = sample["name"] if index < len(samples) else f"Customer {index + 1}"
        customer_email = sample["email"] if index < len(samples) else f"customer{index + 1}@domain.com"
        
        sentiment = sample["sentiment"] if index < len(samples) else sentiments[index % 3]
        sentiment_score = 0.75 if sentiment == 'positive' else -0.80 if sentiment == 'negative' else 0.05
        
        severity = sample["severity"] if index < len(samples) else severities[index % 4]
        status = statuses_list[index % 3]
        cluster_id = f"cluster-{(index % 50) + 1}"
        feature_tag = sample["feature"] if index < len(samples) else features_list[index % 6]
        created_at = (now - timedelta(seconds=index * 1800 * 3)).isoformat().replace("+00:00", "Z")

        feedbacks.append({
            "id": f"feedback-{index + 1}",
            "title": title,
            "content": content,
            "source_type": source_type,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "sentiment": sentiment,
            "sentiment_score": sentiment_score,
            "severity": severity,
            "status": status,
            "cluster_id": cluster_id,
            "feature_tag": feature_tag,
            "created_at": created_at
        })

    # 6. HISTORICAL ANALYTICS (stored in settings or report statistics)
    # We will put these straight into settings or retrieve them when drawing charts.
    # To keep frontend charts consistent, we'll keep them there or serve them from a specific endpoint.

    # 7. EVOLUTION TIMELINE
    timeline_events = [
        {
            "id": "time-1",
            "month": "July 2025",
            "title": "Platform Memory Initialization",
            "description": "Successfully configured Hindsight client vector pipelines. Started scraping Discord user groups.",
            "memory_growth": 15,
            "evolution_type": "memory"
        },
        {
            "id": "time-2",
            "month": "September 2025",
            "title": "Emergence of Stripe Checkout Gateway timeouts",
            "description": "Groq detection marked Stripe 402 response clusters with high priority. Triggered action ticket.",
            "memory_growth": 45,
            "evolution_type": "issue"
        },
        {
            "id": "time-3",
            "month": "November 2025",
            "title": "Workspace Invite Security Patch Release",
            "description": "Resolved the 2-hour invitation token expiry friction. Workspace onboarding statistics increased 18% MoM.",
            "memory_growth": 68,
            "evolution_type": "feature"
        },
        {
            "id": "time-4",
            "month": "February 2026",
            "title": "Deep Memory Retrieval Engine Upgrade",
            "description": "Embedded Hindsight Recall with context mapping. AI assistant response accuracy rose to 98.4%.",
            "memory_growth": 120,
            "evolution_type": "memory"
        },
        {
            "id": "time-5",
            "month": "May 2026",
            "title": "12-Month Historical Forecast Prediction",
            "description": "Began modeling customer pain point vectors to recommend preventative engineering tasks.",
            "memory_growth": 180,
            "evolution_type": "trend"
        }
    ]

    # 8. INTEGRATIONS
    integrations = [
        { "id": "int-1", "name": "Gmail Integration", "type": "email", "status": "Connected", "health": "healthy", "last_sync": "2 mins ago", "records_synced": 1420, "errors": 0 },
        { "id": "int-2", "name": "Slack Link", "type": "chat", "status": "Connected", "health": "healthy", "last_sync": "5 mins ago", "records_synced": 3500, "errors": 0 },
        { "id": "int-3", "name": "Discord Scraper", "type": "chat", "status": "Connected", "health": "warning", "last_sync": "12 mins ago", "records_synced": 2150, "errors": 4 },
        { "id": "int-4", "name": "Zendesk Sync", "type": "support", "status": "Connected", "health": "healthy", "last_sync": "1 hour ago", "records_synced": 1100, "errors": 0 },
        { "id": "int-5", "name": "HubSpot CRM", "type": "crm", "status": "Syncing", "health": "healthy", "last_sync": "Just now", "records_synced": 650, "errors": 0 },
        { "id": "int-6", "name": "Intercom Widget", "type": "support", "status": "Connected", "health": "error", "last_sync": "4 hours ago", "records_synced": 940, "errors": 18 },
        { "id": "int-7", "name": "Reddit Community Scraping", "type": "social", "status": "Connected", "health": "healthy", "last_sync": "3 hours ago", "records_synced": 320, "errors": 0 },
        { "id": "int-8", "name": "Twitter/X Stream API", "type": "social", "status": "Disconnected", "health": "warning", "last_sync": "Never", "records_synced": 0, "errors": 0 },
        { "id": "int-9", "name": "CSV Feed File Upload", "type": "manual", "status": "Connected", "health": "healthy", "last_sync": "1 day ago", "records_synced": 890, "errors": 0 }
    ]

    # 9. NOTIFICATIONS
    notifications = [
        { "id": "not-1", "title": "New Critical Cluster Detected", "message": "Stripe Checkout Gateway Timeout is surging (+42% growth rate in last 4 hours).", "type": "ai", "read": False, "time": "5m ago" },
        { "id": "not-2", "title": "Slack webhook connection warning", "message": "Integration returned status code 429: Too Many Requests on alert dispatcher.", "type": "system", "read": False, "time": "24m ago" },
        { "id": "not-3", "title": "Monthly Report Ready", "message": "May 2026 Executive Performance Summary has been generated.", "type": "trend", "read": True, "time": "2h ago" },
        { "id": "not-4", "title": "Issue #104 Assigned", "message": "Alex Rivera assigned you to 'Investigate checkout failure code 402'.", "type": "issue", "read": True, "time": "1d ago" }
    ]

    # 10. WORKSPACE MEMBERS
    members = [
        { "id": "user-1", "name": "Sarah Jenkins", "email": "sarah@revoxa.ai", "role": "Owner", "avatar": "SJ" },
        { "id": "user-2", "name": "Alex Rivera", "email": "alex@revoxa.ai", "role": "Admin", "avatar": "AR" },
        { "id": "user-3", "name": "Clara Vance", "email": "clara@revoxa.ai", "role": "Manager", "avatar": "CV" },
        { "id": "user-4", "name": "Dave Miller", "email": "dave@revoxa.ai", "role": "Analyst", "avatar": "DM" }
    ]

    # 11. WORKSPACE TASKS
    tasks = [
        { "id": "task-1", "title": "Audit checkout timeout database logs", "assignee": "Dave Miller", "status": "In Progress", "priority": "High" },
        { "id": "task-2", "title": "Verify email template webhook URLs", "assignee": "Alex Rivera", "status": "Open", "priority": "Medium" },
        { "id": "task-3", "title": "Deploy version 4.2 feedback graph nodes", "assignee": "Sarah Jenkins", "status": "Resolved", "priority": "High" },
        { "id": "task-4", "title": "Write weekly board meeting PDF draft", "assignee": "Clara Vance", "status": "In Progress", "priority": "Low" }
    ]

    # 12. HINDSIGHT MOCK MEMORIES (linked to seed data)
    memories = [
        {
            "id": f"feedback-memory-1",
            "bank_id": "default",
            "title": f.get("title", ""),
            "content": f.get("content", ""),
            "created_at": f.get("created_at", "")
        }
        for f in feedbacks[:15] # seed some memories
    ]

    # Assemble full JSON database
    db_data = {
        "memories": memories,
        "models": models,
        "feedbacks": feedbacks,
        "clusters": clusters,
        "features": features,
        "recommendations": recommendations,
        "timelineEvents": timeline_events,
        "integrations": integrations,
        "notifications": notifications,
        "workspaceMembers": members,
        "workspaceTasks": tasks,
        "settings": {
            "ai_model": "openai/gpt-oss-120b (Groq API)",
            "embedding_model": "bge-small-en-v1.5 (384 dimensions)"
        }
    }
    
    return db_data

def seed_database():
    db_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database")
    db_path = os.path.join(db_dir, "hindsight_store.json")
    
    os.makedirs(db_dir, exist_ok=True)
    db_data = generate_seed_data()
    
    with open(db_path, "w") as f:
        json.dump(db_data, f, indent=2)
        
    print(f"Successfully generated full RevoxA mock datasets & seeded database at: {db_path}")

if __name__ == "__main__":
    seed_database()
