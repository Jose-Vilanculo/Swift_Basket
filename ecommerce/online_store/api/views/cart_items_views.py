from rest_framework import viewsets, serializers
from online_store.models import CartItem, Cart
from online_store.api.serializers import CartItemSerializer
from online_store.api.permissions import IsBuyer


class CartItemViewset(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsBuyer]
    http_method_names = ["get", "post", "patch", "delete"]


    def perform_create(self, serializer):

        user = self.request.user
        cart = Cart.objects.get(user=user)

        serializer.save(cart=cart)

    def get_queryset(self):

        # make sure user owns the cart
        return CartItem.objects.filter(
            cart__user=self.request.user
        )
    
    def perform_update(self, serializer):
        
        cart_item = self.get_object()

        # ensure that user owns the cart
        if cart_item.cart.user != self.request.user:
            raise serializers.ValidationError(
                "You do not own this cart"
            )

        serializer.save()
