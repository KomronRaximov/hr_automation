from django.urls import path

from .views import ResumeListView, ResumeUploadView


urlpatterns = [
    path("", ResumeListView.as_view(), name="resume-list"),
    path("upload/", ResumeUploadView.as_view(), name="resume-upload"),
]
