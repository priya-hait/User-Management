from django.conf.urls import patterns, url, include
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from User_Management.views import IndexView
from rest_framework import routers

from authentication.views import AccountViewSet, LoginView, LogoutView, ProfileView

router = routers.DefaultRouter()
router.register(r'accounts', AccountViewSet)

urlpatterns = patterns(
    '',
    url(r'^api/v1/auth/login/$', LoginView.as_view()),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view()),
    url(r'^api/v1/', include(router.urls)),
    url(r'^login/$', TemplateView.as_view(template_name="authentication/login.html"), name='login'),
    url(r'^register/$', TemplateView.as_view(template_name="authentication/register.html"), name='logout'),
    url(r'^(?P<id>\d+)/settings/$', login_required(ProfileView.as_view())),
    url('^.*$', IndexView.as_view(), name='index'),
)
