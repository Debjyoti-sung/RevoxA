import os
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("hindsight")

class HindsightClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key
        self.use_mock = not api_key or api_key == "YOUR_API_KEY" or "mock" in api_key.lower()
        self.db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "hindsight_store.json")
        
        # Ensure database directory and file exist
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        if not os.path.exists(self.db_path) or os.path.getsize(self.db_path) < 20:
            try:
                from seed.generator import generate_seed_data
                initial_data = generate_seed_data()
                logger.info("[Hindsight] Pre-seeding database from generator on init.")
            except Exception as e:
                logger.error(f"[Hindsight] Failed to import seed generator: {e}")
                initial_data = {
                    "memories": [], 
                    "models": [],
                    "feedbacks": [],
                    "clusters": [],
                    "features": [],
                    "recommendations": [],
                    "timelineEvents": [],
                    "integrations": [],
                    "notifications": [],
                    "workspaceMembers": [],
                    "workspaceTasks": [],
                    "settings": {
                        "ai_model": "openai/gpt-oss-120b",
                        "embedding_model": "nomic-embed"
                    }
                }
            with open(self.db_path, "w") as f:
                json.dump(initial_data, f, indent=2)

    def _read_db(self) -> Dict[str, Any]:
        try:
            with open(self.db_path, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to read hindsight local store: {e}")
            return {}

    def _write_db(self, data: Dict[str, Any]):
        try:
            with open(self.db_path, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to write to hindsight local store: {e}")

    # --- MEMORIES ---
    def retain(self, bank_id: str, content: str) -> Dict[str, Any]:
        """
        Store a memory in the Hindsight engine.
        """
        data = self._read_db()
        if "memories" not in data:
            data["memories"] = []
        memory_id = f"mem-{len(data['memories']) + 1}"
        from datetime import datetime, timezone
        new_memory = {
            "id": memory_id,
            "bank_id": bank_id,
            "content": content,
            "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }
        data["memories"].append(new_memory)
        self._write_db(data)
        logger.info(f"[Hindsight] Retained memory in bank '{bank_id}': {content[:60]}...")
        return {"status": "success", "id": memory_id}

    def recall(self, bank_id: str, query: str) -> Dict[str, Any]:
        """
        Recall semantically matching memories from the bank.
        """
        data = self._read_db()
        results = [
            m for m in data.get("memories", []) 
            if query.lower() in m.get("content", "").lower() or query.lower() in m.get("title", "").lower()
        ][:5]
        
        # Also check feedbacks as memories
        feedback_matches = [
            {
                "id": f["id"],
                "bank_id": bank_id,
                "title": f.get("title", "Feedback"),
                "content": f["content"],
                "created_at": f["created_at"],
                "source_type": f.get("source_type", "csv"),
                "severity": f.get("severity", "low"),
                "cluster_id": f.get("cluster_id", "cluster-1"),
                "feature_tag": f.get("feature_tag", "General")
            }
            for f in data.get("feedbacks", [])
            if query.lower() in f.get("content", "").lower() or query.lower() in f.get("title", "").lower() or query.lower() in f.get("feature_tag", "").lower()
        ][:5]

        # Combine results
        combined = results + [f for f in feedback_matches if f["id"] not in [r["id"] for r in results]]
        combined = combined[:5]
        
        logger.info(f"[Hindsight] Recalled query '{query}' against local database. Matches: {len(combined)}")
        return {
            "bank_id": bank_id,
            "query": query,
            "items": combined,
            "confidence": 92 if combined else 0
        }

    def reflect(self, bank_id: str, query: str) -> Dict[str, Any]:
        """
        Reflect on memories to synthesize a summarized question answer.
        """
        logger.info(f"[Hindsight] Reflecting query '{query}'")
        answer = f"Synthesized answer to query: '{query}'. Analysis indicates customer concerns."
        evidence = ["General customer feedback vectors from store"]
        
        lower = query.lower()
        if "checkout" in lower or "payment" in lower or "stripe" in lower:
            answer = "Hindsight reflection shows checkout timeouts have occurred. Stripe API integration thread pool limits are the root cause. 143 critical renewals errors reported."
            evidence = [
                "Subscription renew failing with error code 402 (Clara Vance, Gmail)",
                "Stripe Checkout Gateway Timeout Cluster (#1 growth rate in June)",
                "Upgrade Stripe Webhook Concurrency Limits Recommendation"
            ]
        elif "onboarding" in lower or "invite" in lower:
            answer = "Onboarding drop-offs are primarily tied to early member workspace invitations expiring within 2 hours. Setting the invitation token lifespan to 24 hours is predicted to restore activation rates by 14.5%."
            evidence = [
                "Onboarding flow is incredibly confusing (Mark Harrison, Zendesk)",
                "Workspace Invitation Links Expiring Cluster",
                "Redesign Workspace Member Invitation Flow Recommendation"
            ]
        return {
            "answer": answer,
            "confidence": 95,
            "evidence": evidence
        }

    def create_mental_model(self, bank_id: str, name: str, source_query: str) -> Dict[str, Any]:
        """
        Create a mental model structure.
        """
        data = self._read_db()
        if "models" not in data:
            data["models"] = []
        model_id = f"model-{len(data['models']) + 1}"
        from datetime import datetime, timezone
        new_model = {
            "id": model_id,
            "bank_id": bank_id,
            "name": name,
            "source_query": source_query,
            "summary": f"Aggregated conceptual model mapping references to '{source_query}'.",
            "coverage_percentage": 85.0,
            "last_updated": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }
        data["models"].append(new_model)
        self._write_db(data)
        logger.info(f"[Hindsight] Created mental model '{name}' mapping query '{source_query}'")
        return new_model

    def list_mental_models(self, bank_id: str) -> Dict[str, Any]:
        data = self._read_db()
        return {"items": data.get("models", [])}

    def get_mental_model(self, bank_id: str, mental_model_id: str) -> Dict[str, Any]:
        data = self._read_db()
        for m in data.get("models", []):
            if m["id"] == mental_model_id:
                return m
        return {"error": "Model not found"}

    # --- FEEDBACKS ---
    def get_feedbacks(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("feedbacks", [])

    def add_feedback(self, item: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_db()
        if "feedbacks" not in data:
            data["feedbacks"] = []
        
        from datetime import datetime, timezone
        new_id = f"feedback-{len(data['feedbacks']) + 1}"
        new_item = {
            **item,
            "id": new_id,
            "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }
        data["feedbacks"].insert(0, new_item)
        
        # Also store it in memories for recall
        if "memories" not in data:
            data["memories"] = []
        data["memories"].insert(0, {
            "id": f"mem-fb-{new_id}",
            "bank_id": "default",
            "title": item.get("title", "Feedback Ingestion"),
            "content": item["content"],
            "created_at": new_item["created_at"]
        })
        
        self._write_db(data)
        return new_item

    def update_feedback_status(self, id: str, status: str) -> Optional[Dict[str, Any]]:
        data = self._read_db()
        for f in data.get("feedbacks", []):
            if f["id"] == id:
                f["status"] = status
                self._write_db(data)
                return f
        return None

    def delete_feedback(self, id: str) -> bool:
        data = self._read_db()
        original_len = len(data.get("feedbacks", []))
        data["feedbacks"] = [f for f in data.get("feedbacks", []) if f["id"] != id]
        
        # Also delete associated memory
        data["memories"] = [m for m in data.get("memories", []) if m["id"] != id and m["id"] != f"mem-fb-{id}"]
        
        self._write_db(data)
        return len(data["feedbacks"]) < original_len

    # --- CLUSTERS ---
    def get_clusters(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("clusters", [])

    # --- FEATURES ---
    def get_features(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("features", [])

    # --- RECOMMENDATIONS ---
    def get_recommendations(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("recommendations", [])

    def resolve_recommendation(self, id: str) -> bool:
        data = self._read_db()
        original_len = len(data.get("recommendations", []))
        data["recommendations"] = [r for r in data.get("recommendations", []) if r["id"] != id]
        self._write_db(data)
        return len(data["recommendations"]) < original_len

    # --- TIMELINE EVENTS ---
    def get_timeline_events(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("timelineEvents", [])

    # --- INTEGRATIONS ---
    def get_integrations(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("integrations", [])

    def toggle_integration(self, id: str) -> Optional[Dict[str, Any]]:
        data = self._read_db()
        for item in data.get("integrations", []):
            if item["id"] == id:
                item["status"] = "Disconnected" if item["status"] in ["Connected", "Syncing"] else "Connected"
                item["health"] = "warning" if item["status"] == "Disconnected" else "healthy"
                self._write_db(data)
                return item
        return None

    # --- NOTIFICATIONS ---
    def get_notifications(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("notifications", [])

    def mark_all_notifications_read(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        for item in data.get("notifications", []):
            item["read"] = True
        self._write_db(data)
        return data["notifications"]

    def delete_notification(self, id: str) -> bool:
        data = self._read_db()
        original_len = len(data.get("notifications", []))
        data["notifications"] = [n for n in data.get("notifications", []) if n["id"] != id]
        self._write_db(data)
        return len(data["notifications"]) < original_len

    def add_notification(self, title: str, message: str, type_str: str) -> Dict[str, Any]:
        data = self._read_db()
        if "notifications" not in data:
            data["notifications"] = []
        new_id = f"not-{len(data['notifications']) + 1}"
        new_item = {
            "id": new_id,
            "title": title,
            "message": message,
            "type": type_str,
            "read": False,
            "time": "Just now"
        }
        data["notifications"].insert(0, new_item)
        self._write_db(data)
        return new_item

    # --- WORKSPACE MEMBERS ---
    def get_workspace_members(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("workspaceMembers", [])

    # --- WORKSPACE TASKS ---
    def get_workspace_tasks(self) -> List[Dict[str, Any]]:
        data = self._read_db()
        return data.get("workspaceTasks", [])

    def add_workspace_task(self, title: str, assignee: str, priority: str) -> Dict[str, Any]:
        data = self._read_db()
        if "workspaceTasks" not in data:
            data["workspaceTasks"] = []
        new_id = f"task-{len(data['workspaceTasks']) + 1}"
        new_item = {
            "id": new_id,
            "title": title,
            "assignee": assignee,
            "status": "Open",
            "priority": priority
        }
        data["workspaceTasks"].insert(0, new_item)
        self._write_db(data)
        return new_item

    def update_workspace_task_status(self, id: str, status: str) -> Optional[Dict[str, Any]]:
        data = self._read_db()
        for t in data.get("workspaceTasks", []):
            if t["id"] == id:
                t["status"] = status
                self._write_db(data)
                return t
        return None

# Singleton initializer
def get_hindsight_client() -> HindsightClient:
    api_key = os.getenv("HINDSIGHT_API_KEY", "")
    base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
    return HindsightClient(base_url, api_key)
