from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai_engine.embedding import generate_embedding
from apps.ai_engine.parser import ResumeParseError, extract_text_from_resume

from .models import Candidate, Resume
from .serializers import CandidateSerializer, ResumeListSerializer, ResumeUploadSerializer


class ResumeListView(APIView):
    def get(self, request):
        resumes = Resume.objects.select_related("candidate").order_by("-uploaded_at")
        return Response(ResumeListSerializer(resumes, many=True).data)


class ResumeUploadView(APIView):
    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        candidate = Candidate.objects.create(
            full_name=serializer.validated_data["full_name"],
            email=serializer.validated_data.get("email") or None,
            phone=serializer.validated_data.get("phone") or None,
        )
        resume = Resume.objects.create(candidate=candidate, file=serializer.validated_data["file"])

        try:
            extracted_text = extract_text_from_resume(resume.file.path)
            embedding = generate_embedding(extracted_text)
        except ResumeParseError as exc:
            resume.delete()
            candidate.delete()
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        resume.extracted_text = extracted_text
        resume.embedding = embedding
        resume.save(update_fields=["extracted_text", "embedding"])

        return Response(
            {
                "message": "Resume uploaded and processed successfully",
                "candidate_id": candidate.id,
                "resume_id": resume.id,
            },
            status=status.HTTP_201_CREATED,
        )


class CandidateDetailView(RetrieveAPIView):
    queryset = Candidate.objects.prefetch_related("resumes")
    serializer_class = CandidateSerializer
