@echo off
setlocal

set "ROOT=%~dp0"
set "FRONTEND=%ROOT%frontend"

cd /d "%FRONTEND%"

npm run dev -- --host 127.0.0.1 --port 5173
pause
