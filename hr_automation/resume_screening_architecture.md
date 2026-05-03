# AI-Based Resume Screening and Ranking System Architecture

## 1. Project Overview

This project is an AI-based Resume Screening and Ranking System designed for Human Resource Management. The system allows HR users to upload candidate resumes, enter a job description, and receive a ranked list of candidates based on how closely their resumes match the job requirements.

The system uses Natural Language Processing and semantic similarity techniques to compare resumes with job descriptions. Instead of relying only on simple keyword matching, the system uses `sentence-transformers` to convert resumes and job descriptions into numerical embeddings and calculate similarity scores.

## 2. Main Objective

The main objective of the project is to build a web-based system that can:

- Accept resume files in PDF or DOCX format.
- Extract text from uploaded resumes.
- Process and clean resume text.
- Generate semantic embeddings using `sentence-transformers`.
- Compare each resume with a job description.
- Rank candidates based on match percentage.
- Display candidate information and ranking results through a React frontend.

## 3. Technology Stack

### Backend

- Python
- Django
- Django REST Framework
- sentence-transformers
- PyPDF2 or pdfplumber
- python-docx
- NumPy
- scikit-learn

### Database

- SQLite

SQLite is suitable for the academic prototype because it is simple, lightweight, and does not require a separate database server.

### Frontend

- React
- Axios
- Tailwind CSS
- React Router

### AI / NLP

- sentence-transformers
- Recommended model: `all-MiniLM-L6-v2`
- Similarity method: Cosine Similarity

## 4. High-Level System Architecture

```text
User / HR Officer
        |
        v
React Frontend
        |
        v
Django REST API
        |
        v
Resume Processing Module
        |
        v
AI Matching Engine
        |
        v
SQLite Database
        |
        v
Ranking Result Returned to Frontend
```

## 5. System Modules

## 5.1 Frontend Module

The frontend is responsible for user interaction. It provides pages and components for uploading resumes, entering job descriptions, viewing candidate rankings, and checking candidate details.

### Main Frontend Features

- Resume upload form
- Job description input form
- Candidate ranking table
- Candidate detail page
- Match score display
- Error and loading states
- Downloadable result summary option

### Main Frontend Pages

```text
/src
 ├── pages
 │   ├── Dashboard.jsx
 │   ├── UploadResume.jsx
 │   ├── JobDescription.jsx
 │   ├── RankingResults.jsx
 │   └── CandidateDetail.jsx
 │
 ├── components
 │   ├── Navbar.jsx
 │   ├── ResumeUploadForm.jsx
 │   ├── JobDescriptionForm.jsx
 │   ├── CandidateCard.jsx
 │   └── RankingTable.jsx
 │
 ├── services
 │   └── api.js
 │
 └── App.jsx
```

## 5.2 Backend Module

The Django backend handles business logic, file upload, resume parsing, AI processing, database operations, and API communication with the frontend.

### Main Backend Responsibilities

- Receive uploaded resume files.
- Store resume files.
- Extract text from PDF/DOCX resumes.
- Clean extracted text.
- Generate embeddings from resume text.
- Store candidate and resume data.
- Compare resumes with job descriptions.
- Return ranking results to frontend.

### Suggested Backend Structure

```text
backend/
 ├── manage.py
 ├── config/
 │   ├── settings.py
 │   ├── urls.py
 │   └── wsgi.py
 │
 ├── apps/
 │   ├── candidates/
 │   │   ├── models.py
 │   │   ├── serializers.py
 │   │   ├── views.py
 │   │   ├── urls.py
 │   │   └── services.py
 │   │
 │   ├── jobs/
 │   │   ├── models.py
 │   │   ├── serializers.py
 │   │   ├── views.py
 │   │   └── urls.py
 │   │
 │   └── ai_engine/
 │       ├── embedding.py
 │       ├── matcher.py
 │       ├── parser.py
 │       └── utils.py
 │
 ├── media/
 │   └── resumes/
 │
 └── db.sqlite3
```

## 6. Database Design

## 6.1 Candidate Model

The Candidate model stores basic information about each applicant.

```python
class Candidate(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 6.2 Resume Model

The Resume model stores the uploaded file, extracted text, and embedding data.

```python
class Resume(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="resumes")
    file = models.FileField(upload_to="resumes/")
    extracted_text = models.TextField(blank=True, null=True)
    embedding = models.JSONField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
```

## 6.3 JobDescription Model

The JobDescription model stores job requirements entered by the HR user.

```python
class JobDescription(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    required_skills = models.TextField(blank=True, null=True)
    embedding = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 6.4 MatchResult Model

The MatchResult model stores the similarity score between a resume and a job description.

```python
class MatchResult(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    job_description = models.ForeignKey(JobDescription, on_delete=models.CASCADE)
    match_score = models.FloatField()
    rank_position = models.PositiveIntegerField(blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 7. AI Matching Pipeline

The AI pipeline is the core part of the system.

### Step 1: Resume Upload

The HR user uploads a resume file through the React frontend.

Supported formats:

- PDF
- DOCX

### Step 2: Text Extraction

The Django backend extracts raw text from the uploaded resume.

Recommended libraries:

- `pdfplumber` or `PyPDF2` for PDF files
- `python-docx` for DOCX files

### Step 3: Text Cleaning

The extracted text is cleaned before processing.

Cleaning may include:

- Removing extra spaces
- Removing unnecessary symbols
- Lowercasing text
- Removing duplicated lines
- Normalizing line breaks

### Step 4: Embedding Generation

The cleaned resume text is passed to the `sentence-transformers` model.

Recommended model:

```python
sentence-transformers/all-MiniLM-L6-v2
```

Example:

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
embedding = model.encode(resume_text)
```

### Step 5: Job Description Embedding

The job description text is also converted into an embedding using the same model.

```python
job_embedding = model.encode(job_description)
```

### Step 6: Similarity Calculation

Cosine similarity is calculated between the resume embedding and job description embedding.

```python
from sentence_transformers import util

score = util.cos_sim(job_embedding, resume_embedding)
```

### Step 7: Candidate Ranking

Candidates are sorted by their similarity scores from highest to lowest.

Example:

```text
Rank  Candidate Name       Match Score
1     Ali Karimov          89%
2     Vali Rahimov         76%
3     John Smith           62%
```

## 8. API Design

## 8.1 Resume Upload API

### Endpoint

```http
POST /api/resumes/upload/
```

### Request

```json
{
  "full_name": "Ali Karimov",
  "email": "ali@example.com",
  "phone": "+998901234567",
  "file": "resume.pdf"
}
```

### Response

```json
{
  "message": "Resume uploaded and processed successfully",
  "resume_id": 1
}
```

## 8.2 Job Description Create API

### Endpoint

```http
POST /api/jobs/
```

### Request

```json
{
  "title": "Python Backend Developer",
  "description": "We are looking for a Python developer with Django, REST API, SQL and Git experience.",
  "required_skills": "Python, Django, REST API, SQL, Git"
}
```

### Response

```json
{
  "message": "Job description created successfully",
  "job_id": 1
}
```

## 8.3 Candidate Ranking API

### Endpoint

```http
POST /api/match/job/<job_id>/
```

### Response

```json
[
  {
    "rank": 1,
    "candidate_name": "Ali Karimov",
    "match_score": 89.4,
    "resume_id": 1
  },
  {
    "rank": 2,
    "candidate_name": "Vali Rahimov",
    "match_score": 76.2,
    "resume_id": 2
  }
]
```

## 8.4 Candidate Detail API

### Endpoint

```http
GET /api/candidates/<candidate_id>/
```

### Response

```json
{
  "full_name": "Ali Karimov",
  "email": "ali@example.com",
  "phone": "+998901234567",
  "resumes": [
    {
      "resume_id": 1,
      "uploaded_at": "2026-05-02",
      "extracted_text": "Python developer with Django experience..."
    }
  ]
}
```

## 9. Data Flow

```text
1. HR uploads resume from React frontend.
2. React sends file to Django API.
3. Django saves the file in media/resumes/.
4. Parser extracts text from the file.
5. Cleaned text is stored in SQLite.
6. sentence-transformers generates resume embedding.
7. Embedding is stored in SQLite as JSON.
8. HR enters job description.
9. Job description embedding is generated.
10. System compares job embedding with resume embeddings.
11. Candidates are ranked by similarity score.
12. React displays ranking results.
```

## 10. Matching Logic

The basic matching formula is:

```text
Match Score = Cosine Similarity(Job Description Embedding, Resume Embedding) × 100
```

Example:

```text
Cosine similarity = 0.84
Match score = 84%
```

## 11. Why sentence-transformers?

`sentence-transformers` is suitable for this project because it understands semantic meaning better than basic keyword search.

For example:

```text
Job Description: Backend developer with Python experience
Resume: Django engineer who built REST APIs
```

A simple keyword system may miss the connection, but semantic embeddings can understand that both texts are related.

## 12. Advantages of the Proposed Architecture

- Simple and suitable for academic development.
- Django backend is stable and scalable.
- SQLite is easy to configure.
- React gives a modern user interface.
- sentence-transformers provides real AI-based semantic matching.
- The system can later be upgraded to PostgreSQL and advanced AI models.
- Modular structure makes the project easier to maintain.

## 13. Limitations

- SQLite is not ideal for large-scale production use.
- The model may not fully understand very complex resumes.
- Ranking depends on the quality of extracted text.
- Bias may still exist if the system is not carefully evaluated.
- Large numbers of resumes may require optimization.

## 14. Future Improvements

- Replace SQLite with PostgreSQL.
- Add authentication for HR users.
- Add role-based access control.
- Add advanced skill extraction.
- Add bias detection and fairness checking.
- Add downloadable PDF reports.
- Add dashboard analytics.
- Add multiple job description comparison.
- Add candidate filtering by experience, education, and skills.
- Add explainable AI output showing why each candidate was ranked.

## 15. Development Roadmap

### Phase 1: Project Setup

- Create Django backend.
- Create React frontend.
- Configure Django REST Framework.
- Configure SQLite database.
- Configure media file upload.

### Phase 2: Resume Upload and Parsing

- Build resume upload API.
- Add PDF text extraction.
- Add DOCX text extraction.
- Store extracted text in database.

### Phase 3: AI Matching Engine

- Install sentence-transformers.
- Load `all-MiniLM-L6-v2` model.
- Generate resume embeddings.
- Generate job description embeddings.
- Calculate cosine similarity.

### Phase 4: Ranking System

- Create match result model.
- Rank candidates by match score.
- Return results through API.

### Phase 5: Frontend Interface

- Build upload page.
- Build job description form.
- Build ranking result page.
- Add candidate detail page.

### Phase 6: Testing

- Test resume upload.
- Test text extraction.
- Test similarity score correctness.
- Test ranking order.
- Test frontend and backend integration.

### Phase 7: Documentation

- Write final project report.
- Add screenshots.
- Add system architecture diagram.
- Add testing results.
- Add ethical considerations.

## 16. Recommended Minimum Prototype

For the first working version, the system should include:

- Resume upload
- PDF/DOCX text extraction
- Job description input
- sentence-transformers embedding
- Cosine similarity calculation
- Candidate ranking table
- SQLite storage
- React frontend display

This minimum version is enough to demonstrate the core idea of the project.

## 17. Conclusion

The proposed architecture provides a clear and practical foundation for building an AI-based resume screening and ranking system. The system uses Django as the backend, SQLite as the database, React as the frontend, and sentence-transformers as the AI model for semantic matching.

This architecture is suitable for an academic project because it is realistic, understandable, and extendable. At the same time, it can be upgraded into a production-level system by replacing SQLite with PostgreSQL, adding authentication, improving fairness checking, and integrating more advanced AI features.
