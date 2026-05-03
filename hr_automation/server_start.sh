#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8005}"
SERVER_IP="${SERVER_IP:-185.128.105.36}"

export DJANGO_DEBUG="${DJANGO_DEBUG:-1}"
export DJANGO_ALLOWED_HOSTS="${DJANGO_ALLOWED_HOSTS:-$SERVER_IP,localhost,127.0.0.1}"

echo "Starting Resume Screening on http://$SERVER_IP:$PORT/"
echo

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is not installed."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Install Node.js and npm first."
  exit 1
fi

cd "$BACKEND_DIR"

if [ ! -x ".venv/bin/python" ]; then
  echo "Creating backend virtual environment..."
  python3 -m venv .venv
fi

echo "Installing backend dependencies..."
".venv/bin/python" -m pip install --upgrade pip
".venv/bin/python" -m pip install -r requirements.txt

echo "Applying database migrations..."
".venv/bin/python" manage.py migrate

cd "$FRONTEND_DIR"

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
VITE_API_URL="/api" npm run build

cd "$BACKEND_DIR"

echo
echo "Server is ready:"
echo "  http://$SERVER_IP:$PORT/"
echo
".venv/bin/python" manage.py runserver "$HOST:$PORT"
