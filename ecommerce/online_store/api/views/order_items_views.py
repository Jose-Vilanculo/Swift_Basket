from rest_framework import viewsets
from online_store.models import OrderItem
from online_store.api.serializers import OrderItemSerializer
from online_store.api.permissions import IsVendor


class OrderItemViewset(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [IsVendor]
    http_method_names = ["get"]

    def get_queryset(self):

        # get all order item from users store
        return OrderItem.objects.filter(
            product_variant__product__store__owner=self.request.user
        )
