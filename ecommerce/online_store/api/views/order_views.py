import traceback
from io import BytesIO
from django.core.files import File
from rest_framework import viewsets, serializers
from online_store.models import CartItem, Cart, OrderItem, Order
from online_store.api.serializers import OrderSerializer
from online_store.api.permissions import IsBuyer
from django.http import Http404
from rest_framework.response import Response
import cloudinary.utils
from ..orders.utils import generate_invoice, send_order_confirmation_email
from rest_framework.decorators import action


class OrderViewset(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsBuyer]
    http_method_names = ["get", "post"]

    
    def perform_create(self, serializer):

        # get cart items
        cart = Cart.objects.get(user=self.request.user)
        print("1 - Got cart")

        cart_items = CartItem.objects.filter(cart=cart)

        # dont allow orders without any cart items
        if not cart_items.exists():
            raise serializers.ValidationError(
                "You cannot make an order with no items in your cart."
            )

        # get total price from cart items
        total_price = 0
        for items in cart_items:
            total_price += items.product_variant.final_price * items.quantity


        # Create order
        order = serializer.save(
            user=self.request.user,
            total_price=total_price,
        )
        print("2 - Created order")

        # Create order items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product_variant=item.product_variant,
                quantity=item.quantity,
                price=item.product_variant.final_price,
            )
        print("3 - Created order items")

        # Delete cart items
        cart_items.delete()
        print("4 - Deleted cart")

        # Generate and save invoice
        pdf_buffer = generate_invoice(order)
        pdf_bytes = pdf_buffer.read()

        order.pdf.save(
            f"invoice-{order.id}.pdf",
            File(BytesIO(pdf_bytes)),
            save=True,
        )

        print("4.5 - Generated and saved invoice")

        orderss = Order.objects.latest("date_created_at")

        print(orderss.pdf.name)
        print(orderss.pdf.url)


        # Send user confirmation email
        
        print("5 - About to send email")

        try:
            send_order_confirmation_email(order, pdf_bytes=pdf_bytes)
            print("6 - Email sent")
        except Exception:
            traceback.print_exc()
            raise

    
    def get_queryset(self):

        # Give each user their own orders
        return Order.objects.filter(
            user=self.request.user
        ).order_by("-date_created_at")


    # Endpoint to download users pdf inmvoice
    @action(detail=True, methods=["get"])
    def invoice(self, request, pk=None):
        order = self.get_object() # returns only if user owns it

        if not order.pdf:
            raise Http404("Invoice not found.")


        if not order.pdf:
            raise Http404("Invoice not found.")

        signed_url, options = cloudinary.utils.cloudinary_url(
            order.pdf.name,
            resource_type="raw",
            type="upload",   # change to "authenticated" when invoices are private
            secure=True,
            sign_url=True,
            flags="attachment"
        )

        return Response({
            "url": signed_url
        })
