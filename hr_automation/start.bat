@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"
set "BACKEND_PY=%BACKEND%\.venv\Scripts\python.exe"

echo Starting Resume Screening project...
echo.

if not exist "%BACKEND%" (
  echo Backend folder was not found.
  pause
  exit /b 1
)

if not exist "%FRONTEND%" (
  echo Frontend folder was not found.
  pause
  exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
  echo Python was not found. Install Python and try again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js and try again.
  pause
  exit /b 1
)

cd /d "%BACKEND%"

if not exist "%BACKEND_PY%" (
  echo Creating backend virtual environment...
  python -m venv .venv
  if errorlevel 1 (
    echo Failed to create backend virtual environment.
    pause
    exit /b 1
  )
)

echo Installing backend dependencies...
"%BACKEND_PY%" -m pip install -r requirements.txt
if errorlevel 1 (
  echo Failed to install backend dependencies.
  pause
  exit /b 1
)

echo Applying database migrations...
"%BACKEND_PY%" manage.py migrate
if errorlevel 1 (
  echo Failed to apply database migrations.
  pause
  exit /b 1
)

cd /d "%FRONTEND%"

if not exist "node_modules" (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (
    echo Failed to install frontend dependencies.
    pause
    exit /b 1
  )
)

echo Launching backend and frontend servers...
start "Resume Screening Backend" "%ROOT%run_backend.bat"
start "Resume Screening Frontend" "%ROOT%run_frontend.bat"

timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:5173"

echo.
echo Project is starting.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:5173
echo.
echo Close the backend and frontend terminal windows to stop the project.
pause
