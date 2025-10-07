# Order Management

## What you get
- FastAPI backend (backend/)
- React frontend (frontend/)
- Docker & docker-compose for local run
- Ready-to-deploy: Render (backend) + Vercel (frontend)

## Run locally (fast)
1. From repo root:
   docker-compose up --build

2. Open UI:
   http://localhost:3000

3. API docs:
   http://localhost:8000/docs

## Quick test flow
- Add product → Products page
- Place order → Orders page
- Mark shipped → Shipping page

## Deploy
- Push repo to GitHub.
- Deploy backend to Render (choose backend as root).
- Deploy frontend to Vercel (choose frontend as root).
- In Vercel set env var: REACT_APP_API_BASE = https://<your-backend-url>

(See full deployment steps in the next instructions.)

