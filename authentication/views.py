import json
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework import status, views
from django.contrib.auth import authenticate, login, logout
from django.http.response import HttpResponseForbidden
from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer, AccountUpdateSerializer


class AccountViewSet(viewsets.ModelViewSet):

    lookup_field = 'id'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def get_serializer_class(self):
        serializer_class = self.serializer_class

        if self.request.method == 'PUT':
            serializer_class = AccountUpdateSerializer

        return serializer_class


class LoginView(views.APIView):
    # def get(self, request):
    #     return HttpResponse("hello");
    def post(self, request, format=None):
        data = json.loads(request.body)

        email = data.get('email', None)
        password = data.get('password', None)

        if len(Account.objects.filter(email=email)) == 0:
            return Response(dict({
                u'email': u'User does not exist'
            }), status=status.HTTP_401_UNAUTHORIZED)

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else:
                return Response(dict({
                    u'message': u'This account has been disabled.'
                }), status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(dict({
                u'message': u'Username/password combination invalid.'
            }), status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


class ProfileView(TemplateView):

    template_name = "authentication/settings.html"

    def get_context_data(self, *args, **kwargs):
        context = super(ProfileView, self).get_context_data(*args, **kwargs)
        context['user_profile'] = get_object_or_404(Account, pk=kwargs['id'])
        return context

    def get(self, request, *args, **kwargs):
        id = int(kwargs['id'])
        if request.user.id != id:
            raise PermissionDenied
        return super(ProfileView, self).get(request, *args, **kwargs)