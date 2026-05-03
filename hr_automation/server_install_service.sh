#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
SERVICE_NAME="${SERVICE_NAME:-hr-automation}"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8005}"
SERVER_IP="${SERVER_IP:-185.128.105.36}"
RUN_USER="${RUN_USER:-$(id -un)}"
SUDO="sudo"

if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
elif ! command -v sudo >/dev/null 2>&1; then
  echo "sudo is required to install a systemd service."
  exit 1
fi

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
".venv/bin/python" -m pip install -r requirements-server.txt

echo "Applying database migrations..."
".venv/bin/python" manage.py migrate

cd "$FRONTEND_DIR"

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
VITE_API_URL="/api" npm run build

echo "Writing systemd service: $SERVICE_FILE"
$SUDO tee "$SERVICE_FILE" >/dev/null <<SERVICE
[Unit]
Description=HR Automation Resume Screening
After=network.target

[Service]
Type=simple
User=$RUN_USER
WorkingDirectory=$BACKEND_DIR
Environment=DJANGO_DEBUG=1
Environment=DJANGO_ALLOWED_HOSTS=$SERVER_IP,localhost,127.0.0.1
ExecStart=$BACKEND_DIR/.venv/bin/gunicorn config.wsgi:application --bind $HOST:$PORT --workers 2 --timeout 180
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

echo "Reloading and starting service..."
$SUDO systemctl daemon-reload
$SUDO systemctl enable "$SERVICE_NAME"
$SUDO systemctl restart "$SERVICE_NAME"

echo
echo "Service installed and started."
echo "URL:    http://$SERVER_IP:$PORT/"
echo "Status: sudo systemctl status $SERVICE_NAME"
echo "Logs:   sudo journalctl -u $SERVICE_NAME -f"
