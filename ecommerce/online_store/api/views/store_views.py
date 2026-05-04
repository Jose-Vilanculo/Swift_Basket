from rest_framework import viewsets, serializers
from online_store.models import Store
from rest_framework.permissions import IsAuthenticated
from online_store.api.serializers import StoreSerializer
from online_store.api.permissions import IsVendor


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated, IsVendor]

    def perform_create(self, serializer):
        """Prevents a Vendor from creating multuiple stores

        Args:
            serializer

        Raises:
            serializers.ValidationError
        """
        user = self.request.user

        if Store.objects.filter(owner=user).exists():
            raise serializers.ValidationError("You already have a store.")

        serializer.save(owner=user)

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Store.objects.select_related("owner").all()

        if user.role == "vendor":
            return Store.objects.select_related("owner").filter(owner=user)

        return Store.objects.none()
