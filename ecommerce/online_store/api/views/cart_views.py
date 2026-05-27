from rest_framework import viewsets, serializers
from online_store.models import Cart
from online_store.api.serializers import CartSerializer
from online_store.api.permissions import IsBuyer


class CartViewset(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsBuyer]
    http_method_names = ["get"]

    def get_queryset(self):
        return Cart.objects.filter(
            user=self.request.user
        )
