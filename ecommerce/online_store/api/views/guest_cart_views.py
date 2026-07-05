from rest_framework.views import APIView
from rest_framework.response import Response
from online_store.models import ProductVariant
from online_store.models import CartItem
from online_store.api.serializers import CartItemSerializer


class GuestCartView(APIView):

    def post(self, request):
        items = request.data.get("items", [])

        cart_items = []
        subtotal = 0
        total_products = 0

        for item in items:
            try:
                variant = ProductVariant.objects.select_related("product").get(
                    pk=item["product_variant_id"]
                )

                quantity = max(1, int(item.get("quantity", 1)))

                if quantity > variant.stock:
                    quantity = variant.stock

                cart_items.append(
                    CartItem(
                        product_variant=variant,
                        quantity=quantity
                    )
                )

                subtotal += variant.final_price * quantity
                total_products += quantity

            except ProductVariant.DoesNotExist:
                continue

        serializer = CartItemSerializer(
            cart_items,
            many=True,
            context={"request": request}
        )

        return Response({
            "cartitem_set": serializer.data,
            "subtotal": subtotal,
            "total_products": total_products,
        })
