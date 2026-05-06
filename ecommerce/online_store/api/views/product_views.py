from rest_framework import viewsets
from online_store.models import Product
from rest_framework.permissions import IsAuthenticated
from online_store.api.serializers import ProductSerializer
from online_store.api.permissions import IsVendor


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsVendor]
    http_method_names = ["get", "post", "patch", "delete"]

    def perform_create(self, serializer):
        serializer.save(store=self.request.user.store)

    def get_queryset(self):
        """
        Optomize database query
        """

        queryset = (
            Product.objects
            .select_related("category", "store")
            .prefetch_related("images")
        )


        # get category by slug
        category__slug = self.request.query_params.get("category")
        if category__slug:
            queryset = queryset.filter(category__slug=category__slug)

        return queryset
