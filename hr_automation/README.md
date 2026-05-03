# AI Resume Screening and Ranking System

This repository contains a minimum working prototype based on `resume_screening_architecture.md`.

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

On Windows, you can also double-click `start.bat` from the project root to install missing dependencies, run migrations, start both servers, and open the app. The helper files `run_backend.bat` and `run_frontend.bat` are used by `start.bat`.

On a Linux server, upload the project and run:

```bash
chmod +x server_start.sh
./server_start.sh
```

Default server URL: `http://185.128.105.36:8005/`.

Main frontend pages:

- `/upload` - upload candidate CVs
- `/cvs` - view uploaded CVs
- `/jobs` - create jobs and run ranking

## API

- `POST /api/resumes/upload/`
- `GET /api/resumes/`
- `GET /api/jobs/`
- `POST /api/jobs/`
- `POST /api/jobs/match/job/<job_id>/`
- `POST /api/match/job/<job_id>/`
- `GET /api/candidates/<candidate_id>/`
