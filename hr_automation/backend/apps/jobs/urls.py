from django.urls import path

from .views import CandidateRankingView, JobDescriptionListCreateView


urlpatterns = [
    path("", JobDescriptionListCreateView.as_view(), name="jobs"),
    path("match/job/<int:job_id>/", CandidateRankingView.as_view(), name="candidate-ranking"),
]
