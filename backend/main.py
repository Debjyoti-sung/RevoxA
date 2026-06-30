import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load local environment files
load_dotenv()

# Import local service connectors
from services.hindsight import get_hindsight_client
from services.groq_reasoning import get_groq_reasoning_client

app = FastAPI(
    title="RevoxA Memory Intelligence API",
    description="FastAPI service for feedback vectorization, memory recall, and Groq LLM reasoning.",
    version="1.0.0"
)

# GZip compress all responses ≥ 1KB — significantly reduces payload size
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Enable CORS restricted to the frontend URL
frontend_url = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
allowed_origins = [
    frontend_url,
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients (singletons — loaded once at startup)
hindsight = get_hindsight_client()
groq = get_groq_reasoning_client()


# Request Body schemas
class RetainRequest(BaseModel):
    bank_id: str = "default"
    content: str

class RecallRequest(BaseModel):
    bank_id: str = "default"
    query: str

class ReflectRequest(BaseModel):
    bank_id: str = "default"
    question: str

class AnalyzeRequest(BaseModel):
    content: str

class ModelCreateRequest(BaseModel):
    bank_id: str = "default"
    name: str
    source_query: str

class FeedbackCreateRequest(BaseModel):
    title: str
    content: str
    source_type: str
    customer_name: str
    customer_email: str

class FeedbackStatusUpdateRequest(BaseModel):
    status: str

class TaskCreateRequest(BaseModel):
    title: str
    assignee: str
    priority: str

class TaskStatusUpdateRequest(BaseModel):
    status: str

# Endpoints
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "hindsight_mode": "mock" if hindsight.use_mock else "live",
        "groq_mode": "mock" if groq.use_mock else "live"
    }

# Bulk state endpoint
@app.get("/api/state")
def get_all_state():
    try:
        return {
            "feedbacks": hindsight.get_feedbacks(),
            "clusters": hindsight.get_clusters(),
            "features": hindsight.get_features(),
            "recommendations": hindsight.get_recommendations(),
            "timelineEvents": hindsight.get_timeline_events(),
            "integrations": hindsight.get_integrations(),
            "notifications": hindsight.get_notifications(),
            "workspaceMembers": hindsight.get_workspace_members(),
            "workspaceTasks": hindsight.get_workspace_tasks(),
            "mentalModels": hindsight.list_mental_models("default")["items"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Memory suite
@app.post("/api/memory/retain")
def retain_memory(req: RetainRequest):
    result = hindsight.retain(req.bank_id, req.content)
    return result

@app.post("/api/memory/recall")
def recall_memory(req: RecallRequest):
    result = hindsight.recall(req.bank_id, req.query)
    return result

@app.post("/api/memory/reflect")
def reflect_memory(req: ReflectRequest):
    result = hindsight.reflect(req.bank_id, req.question)
    return result

@app.post("/api/reasoning/analyze")
def analyze_feedback(req: AnalyzeRequest):
    result = groq.analyze_feedback(req.content)
    return result

@app.post("/api/models/create")
def create_model(req: ModelCreateRequest):
    result = hindsight.create_mental_model(req.bank_id, req.name, req.source_query)
    return result

@app.get("/api/models")
def list_models(bank_id: str = "default"):
    result = hindsight.list_mental_models(bank_id)
    return result

# Feedbacks CRUD
@app.get("/api/feedbacks")
def list_feedbacks():
    return hindsight.get_feedbacks()

@app.post("/api/feedbacks")
def create_feedback(req: FeedbackCreateRequest):
    # Perform Groq reasoning layer analysis automatically
    analysis = groq.analyze_feedback(req.content)
    
    # Construct complete feedback model
    feedback_item = {
        "title": req.title,
        "content": req.content,
        "source_type": req.source_type,
        "customer_name": req.customer_name,
        "customer_email": req.customer_email,
        "sentiment": analysis.get("sentiment", "neutral"),
        "sentiment_score": analysis.get("sentiment_score", 0.0),
        "severity": analysis.get("severity", "low"),
        "status": "new",
        "cluster_id": "cluster-1",  # Mock default cluster mapping
        "feature_tag": analysis.get("feature_tag", "General")
    }
    
    # Save feedback using hindsight db logic
    saved_item = hindsight.add_feedback(feedback_item)
    return saved_item

@app.patch("/api/feedbacks/{id}/status")
def update_feedback_status(id: str, req: FeedbackStatusUpdateRequest):
    updated = hindsight.update_feedback_status(id, req.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return updated

@app.delete("/api/feedbacks/{id}")
def delete_feedback(id: str):
    success = hindsight.delete_feedback(id)
    if not success:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return {"status": "success"}

# Recommendations
@app.delete("/api/recommendations/{id}")
def resolve_recommendation(id: str):
    success = hindsight.resolve_recommendation(id)
    if not success:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return {"status": "success"}

# Workspace tasks
@app.post("/api/tasks")
def create_task(req: TaskCreateRequest):
    return hindsight.add_workspace_task(req.title, req.assignee, req.priority)

@app.patch("/api/tasks/{id}/status")
def update_task_status(id: str, req: TaskStatusUpdateRequest):
    updated = hindsight.update_workspace_task_status(id, req.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

# Integrations
@app.post("/api/integrations/{id}/toggle")
def toggle_integration(id: str):
    updated = hindsight.toggle_integration(id)
    if not updated:
        raise HTTPException(status_code=404, detail="Integration not found")
    return updated

# Notifications
@app.post("/api/notifications/read-all")
def mark_all_notifications_read():
    return hindsight.mark_all_notifications_read()

@app.delete("/api/notifications/{id}")
def delete_notification(id: str):
    success = hindsight.delete_notification(id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success"}

@app.post("/api/notifications/simulate")
def simulate_ingestion():
    # Simulate a new incoming feedback item
    import random
    sources = ['slack', 'discord', 'gmail', 'zendesk', 'hubspot', 'intercom', 'reddit', 'twitter']
    names = ['Evelyn Vance', 'Liam Brody', 'Siddharth Nair', 'Emma Watson', 'James Miller', 'Keiko Tanaka']
    issues = [
        "Mobile checkout button is hidden behind navigation bar",
        "Stripe payment failed on mobile client safari",
        "Gmail sync credentials rejected on secondary account",
        "Slack notifications for dashboard errors not triggering",
        "Zendesk ticket status is showing out of sync with workspace"
    ]
    
    random_source = random.choice(sources)
    random_name = random.choice(names)
    random_issue = random.choice(issues)
    
    feedback_content = f"User report: \"{random_issue}\". Ingested from {random_source}."
    
    # Run Groq reasoning to analyze the feedback content
    analysis = groq.analyze_feedback(feedback_content)
    
    feedback_item = {
        "title": f"Live Alert: {random_issue}",
        "content": feedback_content,
        "source_type": random_source,
        "customer_name": random_name,
        "customer_email": f"{random_name.lower().replace(' ', '')}@livefeedback.com",
        "sentiment": "negative",
        "sentiment_score": -0.7,
        "severity": "critical" if random.random() > 0.6 else "high",
        "status": "new",
        "cluster_id": "cluster-1",
        "feature_tag": analysis.get("feature_tag", "Mobile App")
    }
    
    saved = hindsight.add_feedback(feedback_item)
    
    # Also add notification
    notif = hindsight.add_notification(
        title=f"Critical feedback from {random_name}",
        message=random_issue,
        type_str="ai"
    )
    
    return {
        "feedback": saved,
        "notification": notif
    }

if __name__ == "__main__":
    import uvicorn
    # Read port from env or default to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

#main.py is completed