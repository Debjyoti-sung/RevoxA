<div align="center">

# RevoxA

**Feedback intelligence platform powered by Hindsight memory and Groq reasoning.**

RevoxA ingests feedback from Slack, Zendesk, Gmail, Discord, HubSpot, Intercom, and Reddit, classifies it automatically, and lets you **retain**, **recall**, and **reflect** on it like a long-term memory — so you can answer "have we seen this before?" instead of re-discovering the same bug for the fifth time.

</div>

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Routes](#frontend-routes)
- [Mock vs Live Mode](#mock-vs-live-mode)
- [Development Notes](#development-notes)

---

## Overview

RevoxA is split into two services:

- A **Next.js 15 frontend** (App Router, React 19, Tailwind, Zustand) that provides dashboards for feedback, clusters, recommendations, mental models, and a memory graph.
- A **FastAPI backend** that owns two integrations:
  - **Hindsight** — the memory layer (`retain` / `recall` / `reflect`, mental models, clustering)
  - **Groq** — the reasoning layer (sentiment, severity, and feature classification of incoming feedback)

The core idea: every piece of incoming feedback is classified by Groq *before* it's stored, then retained as a memory in Hindsight. Every other feature in the app — clusters, mental models, recommendations, the AI insight cards — is a different lens on that same memory bank.

```
Incoming feedback ──▶ Groq (classify) ──▶ Hindsight (retain) ──▶ Memory Bank
                                                                       │
                                              recall / reflect ◀───────┘
                                                     │
                                          Dashboards, Clusters,
                                       Mental Models, Recommendations
```

---

## How It Works

1. **Ingest** — a feedback item arrives via `/api/feedbacks` (or the simulated live-ingestion endpoint).
2. **Classify** — `GroqReasoningClient.analyze_feedback()` returns sentiment, severity, and a feature tag.
3. **Retain** — the classified item is stored as a memory via `HindsightClient.retain()`.
4. **Recall** — `/api/memory/recall` does a semantic-style lookup across the memory bank and returns matches with a confidence score.
5. **Reflect** — `/api/memory/reflect` takes a natural-language question, recalls relevant memories, and synthesizes an answer with cited evidence and a confidence score.
6. **Visualize** — clusters, mental models, recommendations, and the dashboard's "AI Memory Insight Report" card all read from the same underlying memory bank.

---

## Tech Stack

**Frontend**
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS, Radix UI primitives, Framer Motion
- Zustand for state management
- Recharts for dashboard charts, `@xyflow/react` for the memory graph
- Supabase for auth

**Backend**
- FastAPI + Pydantic
- Groq SDK (`openai/gpt-oss-120b` by default) for reasoning
- Hindsight client for memory (`retain` / `recall` / `reflect` / mental models)
- JSON-backed local store with a deterministic seed generator (`backend/seed/generator.py`)

---

## Project Structure

```
RevoxA-main/
├── backend/
│   ├── main.py                  # FastAPI app & all API routes
│   ├── services/
│   │   ├── hindsight.py         # Hindsight client (retain/recall/reflect, clusters, models)
│   │   └── groq_reasoning.py    # Groq reasoning client (sentiment/severity/tags)
│   ├── seed/
│   │   └── generator.py         # Deterministic seed data generator
│   ├── database/
│   │   ├── hindsight_store.json # Local JSON-backed memory store
│   │   └── schema.sql
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/       # Main dashboard (AI Memory Insight Report)
│   │   │   ├── feedback/        # Feedback inbox
│   │   │   ├── memory/
│   │   │   │   ├── recall/      # Memory recall UI
│   │   │   │   ├── reflect/     # Memory reflect UI
│   │   │   │   ├── models/      # Mental models
│   │   │   │   └── evolution/
│   │   │   ├── memory-graph/    # Visual memory graph
│   │   │   ├── clusters, recommendations, features,
│   │   │   │   issues, trends, reports, workspace,
│   │   │   │   integrations, settings, insights, ...
│   │   │   └── api/             # Next.js API routes (proxy to backend)
│   │   ├── components/
│   │   │   ├── debug/MemoryDebugPanel.tsx  # Live recall/reflect pipeline visualizer (dev only)
│   │   │   └── ...               # AppLayout, Sidebar, Header, Copilot, etc.
│   │   ├── config/              # env, routes, API endpoints, constants
│   │   ├── hooks/useMemoryDebug.ts
│   │   ├── lib/api/              # API client wrappers (incl. hindsight.ts)
│   │   └── store/useStore.ts    # Zustand global store
│   └── package.json
├── package.json
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm / pnpm

### 1. Clone & install

```bash
git clone <repo-url>
cd RevoxA-main

# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

### 2. Configure environment

Copy the variables in [Environment Variables](#environment-variables) into a `.env` / `.env.local` file at the appropriate level (backend root for the FastAPI service, `frontend/` for Next.js). Sensible mock defaults are provided, so the app runs out of the box without any keys.

### 3. Run the backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`. Check `/health` to confirm it's running and whether Hindsight/Groq are in mock or live mode.

### 4. Run the frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`. The dashboard, feedback inbox, and memory pages (`/memory/recall`, `/memory/reflect`) are the best starting points.

---

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | `RevoxA` | App display name |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Frontend base URL (also used for CORS) |
| `NEXT_PUBLIC_ENV` | `development` | Environment flag |
| `NEXT_PUBLIC_SUPABASE_URL` | mock value | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | mock value | Supabase anon key |
| `BACKEND_URL` | `http://127.0.0.1:8000` | URL the Next.js API routes proxy to |
| `SUPABASE_SERVICE_ROLE_KEY` | mock value | Supabase service role key |
| `SUPABASE_JWT_SECRET` | mock value | Supabase JWT secret |
| `HINDSIGHT_API_KEY` | `mock-hindsight-api-key` | Hindsight API key — set to enable live mode |
| `HINDSIGHT_BASE_URL` | `https://api.hindsight.vectorize.io` | Hindsight API base URL |
| `GROQ_API_KEY` *(via groq SDK)* | unset | Groq API key — set to enable live reasoning |
| `DATABASE_URL` | local Postgres default | Database connection string |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | OAuth |

> If `HINDSIGHT_API_KEY` is unset, missing, or contains `"mock"`, the backend falls back to a local JSON-backed store (`backend/database/hindsight_store.json`), auto-seeded on first run by `backend/seed/generator.py`.

---

## API Reference

All endpoints are served by the FastAPI backend at `/`.

### Health & State
| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check, reports mock vs live mode for Hindsight & Groq |
| `GET` | `/api/state` | Bulk fetch of feedbacks, clusters, features, recommendations, timeline, integrations, notifications, workspace data, and mental models |

### Memory (Hindsight)
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/memory/retain` | Store a new memory (`bank_id`, `content`) |
| `POST` | `/api/memory/recall` | Semantic recall of memories matching a query, returns a confidence score |
| `POST` | `/api/memory/reflect` | Ask a question; returns a synthesized answer with evidence and confidence |
| `POST` | `/api/models/create` | Create a mental model from a `source_query` |
| `GET` | `/api/models` | List mental models |

### Reasoning (Groq)
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/reasoning/analyze` | Classify content for sentiment, severity, and feature tag |

### Feedback
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/feedbacks` | List all feedback items |
| `POST` | `/api/feedbacks` | Create feedback (auto-classified via Groq, retained via Hindsight) |
| `PATCH` | `/api/feedbacks/{id}/status` | Update feedback status |
| `DELETE` | `/api/feedbacks/{id}` | Delete feedback and its associated memory |

### Recommendations, Tasks, Integrations, Notifications
| Method | Path | Description |
|---|---|---|
| `DELETE` | `/api/recommendations/{id}` | Resolve/dismiss a recommendation |
| `POST` | `/api/tasks` | Create a workspace task |
| `PATCH` | `/api/tasks/{id}/status` | Update task status |
| `POST` | `/api/integrations/{id}/toggle` | Connect/disconnect an integration |
| `POST` | `/api/notifications/read-all` | Mark all notifications as read |
| `DELETE` | `/api/notifications/{id}` | Delete a notification |
| `POST` | `/api/notifications/simulate` | Simulate a live incoming feedback event (random source, classified via Groq) |

---

## Frontend Routes

| Route | Description |
|---|---|
| `/` | Home |
| `/dashboard` | Main dashboard — AI Memory Insight Report, volume/sentiment charts, critical alerts |
| `/feedback` | Feedback inbox |
| `/memory` | Memory overview |
| `/memory/recall` | Recall memories by query (with confidence score) |
| `/memory/reflect` | Ask questions and get reasoned answers with evidence |
| `/memory/models` | Mental models |
| `/memory/evolution` | Memory evolution over time |
| `/memory-graph` | Interactive memory graph (`@xyflow/react`) |
| `/clusters`, `/issues`, `/trends` | Feedback clustering and trend views |
| `/recommendations`, `/features` | Recommendations and feature requests |
| `/reports` | Executive reports |
| `/workspace` | Team tasks and members |
| `/integrations` | Source integrations (Slack, Zendesk, Gmail, etc.) |
| `/insights` | AI-generated insights |
| `/settings`, `/login`, `/themes` | App settings, auth, theming |

---

## Mock vs Live Mode

RevoxA is designed to run fully offline out of the box:

- **Hindsight**: if `HINDSIGHT_API_KEY` is unset or contains `"mock"`, `HindsightClient` uses a local JSON store at `backend/database/hindsight_store.json`, auto-seeded with realistic demo data (mental models, clusters, feedback, recommendations, notifications, workspace tasks) by `backend/seed/generator.py`.
- **Groq**: if no Groq key is configured, `GroqReasoningClient` returns deterministic mock classifications/reflections instead of calling the live API.
- Check `/health` at any time to see which mode each integration is running in.

To go live, set `HINDSIGHT_API_KEY` / `HINDSIGHT_BASE_URL` and a Groq API key — the same code paths switch from mock to real responses without any frontend changes.

---

## Development Notes

- **Memory Debug Panel** (`frontend/src/components/debug/MemoryDebugPanel.tsx`) — a dev-only panel (hidden when `NODE_ENV !== 'development'`) that visualizes the recall/reflect pipeline step by step: query → recall API → embedding → vector search → top-k retrieval → context injection → LLM response. Useful for understanding (and debugging) what happens on each `/memory/recall` or `/memory/reflect` call.
- **Memory is the source of truth** — feedback is classified by Groq *before* it's retained in Hindsight, so the memory bank never holds unlabeled data. Clusters, mental models, and recommendations are all derived from this same bank rather than a separate pipeline.
- **Confidence scores** drive routing — a `recall` response with `confidence: 0` and no items signals a genuinely new issue; a high-confidence match signals "we've seen this before."

