from rest_framework import viewsets, serializers
from online_store.models import Store
from online_store.api.serializers import StoreSerializer
from online_store.api.permissions import IsStoreOwnerOrReadOnly


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    permission_classes = [IsStoreOwnerOrReadOnly]
    http_method_names = ["get", "post", "patch"]

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

        if user.is_authenticated and user.is_vendor:
            return Store.objects.select_related("owner").filter(owner=user)

        return Store.objects.all()
