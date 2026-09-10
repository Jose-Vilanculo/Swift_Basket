from rest_framework import viewsets, serializers
from online_store.models import CartItem, Cart, OrderItem, Order
from online_store.api.serializers import OrderSerializer
from online_store.api.permissions import IsBuyer
from django.core.mail import EmailMessage
from ..orders.utils import generate_invoice
from django.core.files import File
from django.http import FileResponse, Http404
from rest_framework.decorators import action
from django.conf import settings
import traceback
import socket




class OrderViewset(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsBuyer]
    http_method_names = ["get", "post"]

    def perform_create(self, serializer):
        print(settings.EMAIL_HOST)
        print(settings.EMAIL_PORT)
        print(settings.EMAIL_USE_TLS)
        print(settings.EMAIL_HOST_USER)
        print(settings.DEFAULT_FROM_EMAIL)
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

        # Generate and save invoice
        # pdf = generate_invoice(order)

        # order.pdf.save(
        #     f"invoice-{order.id}.pdf",
        #     File(pdf),
        #     save=True,
        # )

        # Delete cart items
        cart_items.delete()
        print("4 - Deleted cart")


        # Send user confirmation email
        

        email = EmailMessage(
            subject=f"Swift Basket Order #{order.id}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            body=f"""
        Hi {order.shipping_full_name},

        Thank you for shopping with Swift Basket!

        Your order has been received and is being processed.

        Order Number: #{order.id}

        Estimated Delivery:
        {order.estimated_delivery.strftime("%d %b %Y")}

        Your invoice is attached.

        Regards,
        Swift Basket
        """,
            to=[order.user.email],
        )

        # email.attach(
        #     f"Invoice-{order.id}.pdf",
        #     # pdf.read(),
        #     "application/pdf",
        # )
        print("5 - About to send email")

        print("Testing SMTP connection...")

        sock = socket.create_connection(
            ("smtp-relay.brevo.com", 587),
            timeout=10,
        )

        print("Connected!")
        sock.close()

        try:
            email.send()
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

        return FileResponse(
            order.pdf.open("rb"),
            as_attachment=True,
            filename=f"invoice-{order.id}.pdf",
            content_type="application/pdf",
        )