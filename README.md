# Notes App - React (TypeScript) + Flask

A small notes app with:
- User login (username + password). The default user is `admin`.
- List personal notes
- Create, edit, delete notes

Frontend: React + TypeScript + Vite (lives in `frontend/`)  
Backend: Flask + SQLAlchemy + JWT (lives in `backend/`)  
Database: SQLite by default - override with a connection string

---

## Prerequisites
- Python 3.11.13
- Node 18+
- Git recommended

---

## One command to run everything

From the project root:

```bash
./run.sh
```

This will:

Create/activate a Python venv in backend/.venv

Install backend dependencies

Start the Flask API at http://127.0.0.1:5000

Install frontend dependencies

Start the Vite dev server at http://127.0.0.1:5173

Stop with Ctrl+C.

## Backend - manual setup
```
cd backend
python -m venv .venv
```
# mac/linux:
```
source .venv/bin/activate
```
# windows powershell:
```
.\.venv\Scripts\Activate.ps1
```

Then run:
```
pip install -r requirements.txt
cp .env.example .env
```

# Initialize database and seed admin user

```
python manage.py initdb --database-url sqlite:///./notes.db --seed-username admin --seed-password password
```

# Run Flask API

```
python wsgi.py
```
http://127.0.0.1:5000


# Health check:
GET http://127.0.0.1:5000/health


## Database setup

You have two options.

# Option A - Use the CLI (recommended)

```
cd backend
python manage.py initdb --database-url sqlite:///./notes.db --seed-username admin --seed-password password
```

Seeds a default user admin with password password.

# Option B - Apply schema.sql manually

The schema lives in backend/schema.sql.

SQLite:
```
cd backend
sqlite3 notes.db < schema.sql
```

Postgres:
```
psql "$DATABASE_URL" -f backend/schema.sql
```

You must manually insert the admin user if you use schema.sql directly.

## Frontend - run your Vite app
```
cd frontend
npm install
npm run dev
```
App: http://127.0.0.1:5173


Make sure your .env in frontend/ points to the backend:
```
VITE_API_BASE=http://127.0.0.1:5000
```


## API summary

#  POST /api/login

Body: { "username": string, "password": string }
Returns: { token, user: { id, username } }
Use Authorization: Bearer <token> header for the calls below.

# GET /api/notes

List notes for the authenticated user.

# POST /api/notes

Body: { "title": string, "content": string }
Create a note.

# PUT /api/notes/:id

Body: { "title"?: string, "content"?: string }
Update a note.

# DELETE /api/notes/:id

Delete a note.


## Troubleshooting

401 errors → Make sure you send Authorization: Bearer <token> header after login.

CORS errors → Confirm backend is running at VITE_API_BASE and Flask CORS is enabled.

DB missing → Run manage.py initdb or apply schema.sql and seed the admin user.