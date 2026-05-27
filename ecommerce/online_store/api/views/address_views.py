from rest_framework import viewsets
from online_store.models import Address
from rest_framework.permissions import IsAuthenticated
from online_store.api.serializers import AddressSerializer


class AddressViewset(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(
            user=self.request.user
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
