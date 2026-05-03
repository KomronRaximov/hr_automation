from django.db import models

from apps.candidates.models import Resume


class JobDescription(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    required_skills = models.TextField(blank=True, null=True)
    embedding = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title


class MatchResult(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    job_description = models.ForeignKey(JobDescription, on_delete=models.CASCADE)
    match_score = models.FloatField()
    rank_position = models.PositiveIntegerField(blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("resume", "job_description")
        ordering = ["rank_position", "-match_score"]

    def __str__(self) -> str:
        return f"{self.job_description.title}: {self.resume} ({self.match_score})"
