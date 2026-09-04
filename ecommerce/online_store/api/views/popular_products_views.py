from rest_framework import viewsets
from online_store.models import Product
from online_store.api.serializers import ProductSerializer

class PopularProductsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_popular=True)
            .order_by("-updated_at")[:7]
        )