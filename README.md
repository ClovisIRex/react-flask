# Notes App - React (TypeScript) + Flask

## Backend
```bash
cd backend
python -m venv .venv
# mac/linux:
source .venv/bin/activate
# windows powershell:
# .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
# Initialize a new database and seed a user
python manage.py initdb --database-url sqlite:///./notes.db --seed-email test@example.com --seed-password password
# Run
python wsgi.py
# API: http://127.0.0.1:5000
# Health: http://127.0.0.1:5000/health

