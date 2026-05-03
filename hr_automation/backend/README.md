# Resume Screening Backend

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`

CUDA is not required. The default requirements use the built-in lightweight CPU fallback. Optional semantic matching can be enabled with:

```bash
pip install -r requirements-ai.txt
```
