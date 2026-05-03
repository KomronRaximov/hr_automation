from django.urls import path

from .views import CandidateRankingView


urlpatterns = [
    path("<int:job_id>/", CandidateRankingView.as_view(), name="candidate-ranking-root"),
]
