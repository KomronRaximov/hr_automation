@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "BACKEND_PY=%BACKEND%\.venv\Scripts\python.exe"

cd /d "%BACKEND%"

if not exist "%BACKEND_PY%" (
  echo Backend virtual environment was not found.
  echo Run start.bat first so it can create .venv and install dependencies.
  pause
  exit /b 1
)

"%BACKEND_PY%" manage.py runserver 127.0.0.1:8000
pause
