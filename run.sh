#!/usr/bin/env bash
set -euo pipefail

# Paths
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# Decide which Python to use for the backend
# Preference order:
# 1) If python3.11 exists, ensure backend/.venv is a 3.11 venv and use it
# 2) Else, if a venv is already activated (VIRTUAL_ENV), use its python
# 3) Else, create/use backend/.venv with default python3
PYTHON_BIN=""

if command -v python3.11 >/dev/null 2>&1; then
  TARGET_VENV="$BACKEND_DIR/.venv"
  # Recreate the venv if missing or not Python 3.11
  NEED_NEW_VENV=1
  if [ -d "$TARGET_VENV" ]; then
    if [ -x "$TARGET_VENV/bin/python" ]; then
      if "$TARGET_VENV/bin/python" -c 'import sys; import sys; exit(0) if sys.version_info[:2]==(3,11) else exit(1)'; then
        NEED_NEW_VENV=0
      fi
    elif [ -x "$TARGET_VENV/Scripts/python.exe" ]; then
      if "$TARGET_VENV/Scripts/python.exe" -c "import sys; exit(0) if sys.version_info[:2]==(3,11) else exit(1)"; then
        NEED_NEW_VENV=0
      fi
    fi
  fi

  if [ "$NEED_NEW_VENV" -eq 1 ]; then
    echo "[backend] Creating Python 3.11 virtualenv at backend/.venv ..."
    rm -rf "$TARGET_VENV"
    python3.11 -m venv "$TARGET_VENV"
  fi

  if [ -x "$TARGET_VENV/bin/python" ]; then
    PYTHON_BIN="$TARGET_VENV/bin/python"
  else
    PYTHON_BIN="$TARGET_VENV/Scripts/python.exe"
  fi

elif [ -n "${VIRTUAL_ENV:-}" ] && command -v python >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python)"

else
  if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo "[backend] Creating virtualenv at backend/.venv ..."
    python3 -m venv "$BACKEND_DIR/.venv"
  fi
  if [ -x "$BACKEND_DIR/.venv/bin/python" ]; then
    PYTHON_BIN="$BACKEND_DIR/.venv/bin/python"
  elif [ -x "$BACKEND_DIR/.venv/Scripts/python.exe" ]; then
    PYTHON_BIN="$BACKEND_DIR/.venv/Scripts/python.exe"
  else
    echo "[backend] Could not locate python in backend/.venv" >&2
    exit 1
  fi
fi

echo "[backend] Using Python at: $PYTHON_BIN"

# Install backend deps inside the chosen interpreter only
echo "[backend] Installing requirements..."
"$PYTHON_BIN" -m pip install --upgrade pip setuptools wheel >/dev/null
"$PYTHON_BIN" -m pip install -r "$BACKEND_DIR/requirements.txt"

# Ensure .env exists
if [ ! -f "$BACKEND_DIR/.env" ] && [ -f "$BACKEND_DIR/.env.example" ]; then
  echo "[backend] Creating .env from example..."
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

# Start backend
echo "[backend] Starting Flask API on http://127.0.0.1:5000 ..."
pushd "$BACKEND_DIR" >/dev/null
"$PYTHON_BIN" wsgi.py &
BACKEND_PID=$!
popd >/dev/null

cleanup() {
  echo ""
  echo "Shutting down..."
  if ps -p $BACKEND_PID >/dev/null 2>&1; then
    kill $BACKEND_PID 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

# Frontend - run Vite dev if available
if [ -f "$FRONTEND_DIR/package.json" ]; then
  echo "[frontend] Installing npm packages..."
  pushd "$FRONTEND_DIR" >/dev/null
  if command -v npm >/dev/null 2>&1; then
    if [ -f package-lock.json ]; then
      npm ci || npm install
    else
      npm install
    fi
    echo "[frontend] Starting Vite on http://127.0.0.1:5173 ..."
    npm run dev
  else
    echo "[frontend] npm not found. Only backend is running."
    echo "Press Ctrl+C to stop."
    wait $BACKEND_PID
  fi
  popd >/dev/null
else
  echo "[frontend] No frontend found at $FRONTEND_DIR. Only backend is running."
  echo "Press Ctrl+C to stop."
  wait $BACKEND_PID
fi
