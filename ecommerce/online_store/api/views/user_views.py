from rest_framework import viewsets
from online_store.models import CustomUser
from rest_framework.permissions import IsAuthenticated
from online_store.api.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch"]

    def get_queryset(self):
        return CustomUser.objects.filter(
            id=self.request.user.id
        )