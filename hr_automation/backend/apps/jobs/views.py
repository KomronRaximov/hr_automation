from django.db import OperationalError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai_engine.embedding import generate_embedding
from apps.ai_engine.matcher import build_explanation, cosine_similarity_percent
from apps.candidates.models import Resume

from .models import JobDescription, MatchResult
from .serializers import JobDescriptionSerializer, RankingResultSerializer


class JobDescriptionListCreateView(APIView):
    def get(self, request):
        jobs = JobDescription.objects.order_by("-created_at")
        return Response(JobDescriptionSerializer(jobs, many=True).data)

    def post(self, request):
        serializer = JobDescriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        combined_text = " ".join(
            [
                serializer.validated_data["title"],
                serializer.validated_data["description"],
                serializer.validated_data.get("required_skills") or "",
            ]
        )
        job = serializer.save(embedding=generate_embedding(combined_text))
        return Response(
            {
                "message": "Job description created successfully",
                "job_id": job.id,
            },
            status=status.HTTP_201_CREATED,
        )


class CandidateRankingView(APIView):
    def post(self, request, job_id):
        try:
            job = JobDescription.objects.get(pk=job_id)
        except JobDescription.DoesNotExist:
            return Response({"error": "Job description not found."}, status=status.HTTP_404_NOT_FOUND)

        if not job.embedding:
            job.embedding = generate_embedding(f"{job.title} {job.description} {job.required_skills or ''}")
            job.save(update_fields=["embedding"])

        selected_resume_ids = request.data.get("resume_ids")
        if selected_resume_ids is not None and not selected_resume_ids:
            return Response({"error": "Select at least one resume to rank."}, status=status.HTTP_400_BAD_REQUEST)

        resumes = Resume.objects.select_related("candidate").exclude(embedding__isnull=True)
        if selected_resume_ids is not None:
            resumes = resumes.filter(id__in=selected_resume_ids)

        rows = []
        for resume in resumes:
            score = cosine_similarity_percent(job.embedding, resume.embedding or [])
            explanation = build_explanation(score)
            rows.append(
                {
                    "resume": resume,
                    "score": score,
                    "explanation": explanation,
                }
            )

        rows.sort(key=lambda item: item["score"], reverse=True)
        results = []
        for index, row in enumerate(rows, start=1):
            resume = row["resume"]
            results.append(
                {
                    "rank": index,
                    "candidate_id": resume.candidate_id,
                    "candidate_name": resume.candidate.full_name,
                    "email": resume.candidate.email,
                    "phone": resume.candidate.phone,
                    "match_score": row["score"],
                    "resume_id": resume.id,
                    "explanation": row["explanation"],
                }
            )

        self._store_results(job, rows)
        return Response(RankingResultSerializer(results, many=True).data)

    def _store_results(self, job, rows):
        for index, row in enumerate(rows, start=1):
            try:
                MatchResult.objects.update_or_create(
                    resume=row["resume"],
                    job_description=job,
                    defaults={
                        "match_score": row["score"],
                        "rank_position": index,
                        "explanation": row["explanation"],
                    },
                )
            except OperationalError as exc:
                if "database is locked" not in str(exc).lower():
                    raise
                return
