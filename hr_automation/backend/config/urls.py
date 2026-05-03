from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.static import serve
from django.urls import include, path
from django.urls import re_path

from .views import FrontendAppView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/resumes/", include("apps.candidates.urls")),
    path("api/candidates/", include("apps.candidates.detail_urls")),
    path("api/jobs/", include("apps.jobs.urls")),
    path("api/match/job/", include("apps.jobs.match_urls")),
    re_path(r"^assets/(?P<path>.*)$", serve, {"document_root": settings.FRONTEND_ASSETS_DIR}),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [
    re_path(r"^(?!api/|admin/|media/|assets/).*", FrontendAppView.as_view(), name="frontend-app"),
]
