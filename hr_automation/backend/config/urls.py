from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/resumes/", include("apps.candidates.urls")),
    path("api/candidates/", include("apps.candidates.detail_urls")),
    path("api/jobs/", include("apps.jobs.urls")),
    path("api/match/job/", include("apps.jobs.match_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
