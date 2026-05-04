from rest_framework import viewsets
from online_store.models import ProductImage
from rest_framework.permissions import IsAuthenticated
from online_store.api.serializers import ProductImageSerializer


class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    queryset = ProductImage.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete"]

    def perform_create(self, serializer):
        product = serializer.validated_data["product"]

        if product.store.owner != self.request.user:
            raise PermissionError("You do not own this store!")

        serializer.save()
