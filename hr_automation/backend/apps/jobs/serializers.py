from rest_framework import serializers

from .models import JobDescription


class JobDescriptionSerializer(serializers.ModelSerializer):
    job_id = serializers.IntegerField(source="id", read_only=True)

    class Meta:
        model = JobDescription
        fields = ["job_id", "title", "description", "required_skills", "created_at"]
        read_only_fields = ["job_id", "created_at"]


class RankingResultSerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    candidate_id = serializers.IntegerField()
    candidate_name = serializers.CharField()
    email = serializers.EmailField(allow_null=True)
    phone = serializers.CharField(allow_null=True)
    match_score = serializers.FloatField()
    resume_id = serializers.IntegerField()
    explanation = serializers.CharField()
