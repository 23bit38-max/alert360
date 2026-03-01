# ==========================================
# ALERT360 SERVER STARTUP
# ==========================================

# OPTION 1: Run the Model/Backend only (Direct via Uvicorn)
uvicorn app.api:app --reload --port 8000

# OPTION 2: Run the ENTIRE system (Frontend + Backend) via Docker Compose
# (Run this from the main alert360 folder where docker-compose.yml lives)
docker compose up --build -d

