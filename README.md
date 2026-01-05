# 🤖 Agentic RAG: Autonomous Knowledge Base System

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Deployment](https://img.shields.io/badge/Deployed%20on-Azure%20%26%20Vercel-blue)
![AI Model](https://img.shields.io/badge/AI-Google%20Gemini%201.5-orange)

An intelligent, self-hosted **Retrieval-Augmented Generation (RAG)** system designed to query internal documentation with high precision. This project orchestrates autonomous AI agents using **n8n** to dynamically route user queries, retrieve context via **PostgreSQL (pgvector)**, and synthesize answers using **Google Gemini**.

---

## 🚀 Key Features

* **Autonomous Agent Routing:** Uses an n8n AI Agent to intelligently decide when to search the knowledge base versus answering general questions.
* **Semantic Search Engine:** Implemented high-performance vector retrieval using **PostgreSQL (pgvector)** and **Gemini Embeddings** to find relevant context in uploaded documents.
* **Self-Hosted Architecture:** Fully containerized backend running on **Microsoft Azure Web Apps** via Docker Compose.
* **Persistent Workflow Storage:** Optimized configuration using **SQLite** for n8n workflow persistence and **Postgres** for ephemeral vector data.
* **Secure Cross-Cloud Proxy:** Custom **Vercel** middleware (`vercel.json`) to handle CORS-free communication between the React frontend and Azure backend.
* **Document Ingestion Pipeline:** Automated workflow to upload, chunk, and embed PDF/Text documents with metadata tagging.

---

## 🛠️ Tech Stack

### **Backend & Infrastructure**
* **Orchestration:** [n8n](https://n8n.io/) (Workflow Automation)
* **Vector Database:** PostgreSQL with `pgvector` extension
* **Cloud Provider:** Microsoft Azure (App Service / Web App for Containers)
* **Containerization:** Docker & Docker Compose

### **AI & LLM**
* **Inference Model:** Google Gemini 1.5 Pro / Flash
* **Embeddings:** Google Gemini Text Embeddings

### **Frontend**
* **Framework:** React (Vite) + TypeScript
* **Styling:** Tailwind CSS (or custom CSS)
* **Deployment:** Vercel

---

## 🏗️ Architecture

```mermaid
graph TD
    User[User via React App] -->|HTTPS Request| Vercel[Vercel Proxy]
    Vercel -->|Secure Forward| Azure[Azure Web App (n8n)]
    
    subgraph "Azure Container Group"
        Azure -->|Router| Agent[AI Agent]
        Agent -->|General Query| Gemini[Google Gemini API]
        Agent -->|Knowledge Search| PG[PostgreSQL (pgvector)]
    end
    
    subgraph "Data Pipeline"
        Upload[Upload Document] -->|Chunk & Embed| Gemini
        Gemini -->|Store Vectors| PG
    end
