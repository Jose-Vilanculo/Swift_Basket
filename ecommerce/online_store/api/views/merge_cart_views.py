from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from online_store.models import Cart, CartItem, ProductVariant


class MergeCartView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        items = request.data.get("items", [])

        cart, _ = Cart.objects.get_or_create(user=request.user)

        for item in items:
            variant = ProductVariant.objects.get(
                id=item["product_variant_id"]
            )

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product_variant=variant,
                defaults={
                    "quantity": item["quantity"]
                }
            )

            if not created:
                cart_item.quantity += item["quantity"]
                cart_item.save(update_fields=["quantity"])

        return Response({"message": "Cart merged successfully"})