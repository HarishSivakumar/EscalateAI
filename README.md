# 🚨 EscalateAI — AI-Powered Escalation Intelligence Platform

## 📌 Overview

**EscalateAI** is an AI-driven system designed to enhance **Incident & Case Management (ICM)** workflows by proactively identifying and preventing customer support escalations.

It analyzes conversations in real time, detects failure signals, predicts escalation risk, and provides actionable insights through interactive dashboards.

> 🎯 **Goal:** Detect issues early and prevent escalation before it happens.

---

## ✨ Features

### 🔍 Real-Time Conversation Analysis

* Dynamic analysis of user-agent conversations
* Tracks conversation progression over time
* Identifies early warning signals

### ⚠️ Escalation Risk Prediction

* Predicts escalation probability (0 → 1)
* Classifies risk: **Low / Medium / High**
* Detects escalation at **turn-level granularity**

### 🧩 Failure Signal Detection

Structured signal extraction including:

* Resolution failure
* Repetition detection
* Technical errors
* Response delays
* Communication gaps
* Emotional escalation

### 😊 Sentiment & Emotion Tracking

* Tracks emotional progression (Neutral → Negative → Frustrated)
* Detects frustration spikes
* Correlates sentiment with escalation risk

### 🔥 Priority Classification

Automatically assigns:

* **P1 (Critical)**
* **P2 (High)**
* **P3 (Medium/Low)**

Based on urgency, impact, and failure severity.

### 📊 Explainability Engine

Provides reasoning behind predictions:

* Repeated unresolved issues
* Negative sentiment trends
* High urgency signals

### 🧾 Conversation Summary

* Structured summaries
* Full transcript storage
* Highlighted critical moments

---

## 📈 Analytics & Dashboards

### Conversation Insights

* Escalation rate
* Risk distribution
* Conversation volume

### Failure Analysis

* Top escalation drivers
* Signal frequency breakdown

### Trend Analysis

* Escalations over time
* Risk progression graphs

### 🧪 Model Evaluation

* Precision, Recall, F1 Score, Accuracy
* Early Detection Score
* False Positive Rate
* Latency tracking

---

## 💬 Live Monitoring Interface

* Chat-style UI
* Real-time analysis
* Instant risk updates

---

## 🏥 System Health Monitoring

* API latency
* Model performance
* Error rates
* Uptime tracking

---

## 🧩 Architecture

```
Frontend (Next.js)
        ↓
Backend API (FastAPI / Node)
        ↓
AI Engine (ML + LLM + Rules)
        ↓
Database (Supabase / SQLite)
        ↓
Dashboards & Analytics
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts

### Backend

* FastAPI (Python) / Node.js
* REST APIs

### AI / ML

* scikit-learn
* Rule-based signal extraction
* LLM integration (Ollama / APIs)

### Database

* Supabase (PostgreSQL) / SQLite

### DevOps

* Vercel (Frontend)
* Render (Backend)
* GitHub Actions

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/harishsivakumar/EscalateAI.git
cd EscalateAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the frontend

```bash
npm run dev
```

App will be available at:

```
http://localhost:3000
```

---

## 📡 API Example

### Endpoint

```
POST /analyze
```

### Request

```json
{
  "conversation_id": "conv_001",
  "messages": [
    { "role": "user", "text": "My API is not working" },
    { "role": "agent", "text": "Can you share logs?" },
    { "role": "user", "text": "Still not working" }
  ]
}
```

### Response

```json
{
  "escalation_risk": 0.82,
  "priority": "HIGH",
  "predicted_escalation": true,
  "detected_at_turn": 3,
  "signals": {
    "repetition_count": 1,
    "resolution_failure": true
  },
  "explanation": [
    "Issue repeated",
    "No resolution detected",
    "Negative sentiment increasing"
  ]
}
```

---

## 🎯 Use Cases

* SaaS Customer Support Platforms
* Incident & Case Management Systems
* IT Helpdesk Automation
* Customer Experience Optimization

---

## 🚀 Key Differentiators

* Real-time escalation detection
* Early warning system (pre-escalation)
* Explainable AI outputs
* Hybrid system (ML + LLM + rules)
* Production-ready architecture

---

## 🔮 Future Enhancements

* RAG-based response suggestions
* Agent recommendation system
* Real-time streaming (WebSockets)
* CRM integrations
* Multi-tenant architecture

---

## 👨‍💻 Author

**Harish Sivakumar**

---

## 📌 Summary

EscalateAI is a **production-style AI system** combining:

* Predictive intelligence
* Real-time monitoring
* Explainability
* Analytics

👉 Built to simulate real-world AI systems used in modern customer support environments.
