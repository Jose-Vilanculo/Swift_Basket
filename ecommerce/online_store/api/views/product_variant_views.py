from rest_framework import viewsets, serializers
from online_store.models import ProductVariant
from online_store.api.serializers import ProductVariantSerializer
from online_store.api.permissions import IsOwnerVendorOrReadOnly


class ProductVariantViewset(viewsets.ModelViewSet):
    serializer_class = ProductVariantSerializer
    queryset = ProductVariant.objects.all()
    permission_classes = [IsOwnerVendorOrReadOnly]
    http_method_names = ["get", "post", "patch", "delete"]

    def perform_create(self, serializer):

        # ensure vendor owns the store
        product = serializer.validated_data["product"]
        if product.store.owner != self.request.user:
            raise serializers.ValidationError(
                "You do not own this store!"
            )


        # prevent the same attribute from being create twice
        attributes = serializer.validated_data["attributes"]

        product_variant = ProductVariant.objects.filter(
            product=product,
            attributes=attributes
        )

        if product_variant:
            raise serializers.ValidationError(
                "You already have this variant"
            )

        serializer.save()
