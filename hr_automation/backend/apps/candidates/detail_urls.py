from django.urls import path

from .views import CandidateDetailView


urlpatterns = [
    path("<int:pk>/", CandidateDetailView.as_view(), name="candidate-detail"),
]
