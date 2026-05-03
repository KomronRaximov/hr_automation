from rest_framework import serializers

from .models import Candidate, Resume


class ResumeSerializer(serializers.ModelSerializer):
    resume_id = serializers.IntegerField(source="id", read_only=True)

    class Meta:
        model = Resume
        fields = ["resume_id", "file", "extracted_text", "uploaded_at"]
        read_only_fields = ["resume_id", "extracted_text", "uploaded_at"]


class ResumeListSerializer(serializers.ModelSerializer):
    resume_id = serializers.IntegerField(source="id", read_only=True)
    candidate_id = serializers.IntegerField(source="candidate.id", read_only=True)
    candidate_name = serializers.CharField(source="candidate.full_name", read_only=True)
    email = serializers.EmailField(source="candidate.email", read_only=True, allow_null=True)
    phone = serializers.CharField(source="candidate.phone", read_only=True, allow_null=True)
    file_name = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ["resume_id", "candidate_id", "candidate_name", "email", "phone", "file_name", "uploaded_at"]

    def get_file_name(self, obj):
        return obj.file.name.rsplit("/", 1)[-1]


class CandidateSerializer(serializers.ModelSerializer):
    resumes = ResumeSerializer(many=True, read_only=True)

    class Meta:
        model = Candidate
        fields = ["id", "full_name", "email", "phone", "created_at", "resumes"]


class ResumeUploadSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    file = serializers.FileField()

    def validate_file(self, file):
        name = file.name.lower()
        if not (name.endswith(".pdf") or name.endswith(".docx")):
            raise serializers.ValidationError("Only PDF and DOCX files are supported.")
        return file
