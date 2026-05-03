from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View


class FrontendAppView(View):
    def get(self, request, *args, **kwargs):
        index_path = settings.FRONTEND_DIST_DIR / "index.html"
        if not index_path.exists():
            return HttpResponse(
                "Frontend build was not found. Run server_start.sh or build the frontend first.",
                status=503,
                content_type="text/plain",
            )
        return HttpResponse(index_path.read_text(encoding="utf-8"), content_type="text/html")
