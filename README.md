# Minimal React + Flask (no npm, no build tools)

## Backend
cd backend
python -m venv .venv
# mac/linux:
source .venv/bin/activate
# windows powershell:
# .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python wsgi.py
# API at http://127.0.0.1:5000

## Frontend
Open frontend/index.html in a browser
# or serve it:
# cd frontend && python -m http.server 5173
# then open http://127.0.0.1:5173
