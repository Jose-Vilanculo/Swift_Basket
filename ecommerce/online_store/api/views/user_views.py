from rest_framework import viewsets
from online_store.models import CustomUser
from rest_framework.permissions import AllowAny
from online_store.api.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    http_method_names = ["post"]
