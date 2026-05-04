from online_store.models import Order, OrderItem, Cart
from django.core.mail import EmailMessage
from django.shortcuts import render, redirect, get_object_or_404


def user_orders_view(request):
    """
    Displays a list of past orders made by the currently logged-in user.

    Args:
        request: The HTTP request object.

    Returns:
        Renders the user_orders.html template with the user's orders.
    """
    orders = Order.objects.filter(user=request.user).order_by(
        "-date_created_at"
    )
    return render(request, "online_store/orders/user_orders.html",
                  {"orders": orders})


def create_email_message(user, order_summary, total_price, order):
    """
    Creates a formatted invoice and payment instruction
    email message for the user.

    Args:
        user: The user placing the order.
        order_summary: A string summarizing the items in the order.
        total_price: The total price of the order.
        order: The order instance for reference and tracking.

    Returns:
        A formatted string message to be used in an email.
    """
    message = (
        f"Hi {user.username},\n\n"
        f"Thank you for shopping with SwiftBasket.\n"
        f"Below is your invoice:\n\n"

        f"Order Summary:\n"
        f"{order_summary}\n"
        f"Total Amount Due: R{total_price:.2f}\n\n"

        f"To confirm order, please make payment to the following account:\n"
        f"{'-'*60}\n"
        f"Bank Name     : SwiftBank\n"
        f"Account Name  : SwiftBasket Payments\n"
        f"Account Number: 1234567890\n"
        f"Branch Code   : 000123\n"
        f"Reference     : {user.username.upper()}-{order.pk}\n"
        f"{'-'*60}\n\n"

        f"Once payment is received, we'll begin processing your order\n"
        f"for shipment.\n\n"

        f"If you have any questions, feel free to reply to this email.\n\n"
        f"Thank you for your business!\n"
        f"- SwiftBasket Team"
    )

    return message


def checkout(request):
    """
    Handles the checkout process: creates an order,
    sends an invoice email, and clears the cart.

    Args:
        request: The HTTP request object.

    Returns:
        Redirect to buyer_home on success.
        Renders the checkout page with cart items and total price.
    """
    user = request.user
    if not user.is_authenticated:
        return redirect("login_buyer")
    cart = get_object_or_404(Cart, user=user)
    cart_items = cart.cartitem_set.all()
    total_price = sum(
                item.items.price * item.quantity for item in cart_items
            )

    if request.method == "POST":
        if not cart.cartitem_set.exists():
            return redirect("view_cart")

        # create order
        order = Order.objects.create(
            user=user,
            total_price=total_price)

        # create order items
        order_summary = ""   # for email purpose
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.items.product_name,
                quantity=item.quantity,
                price=item.items.price * item.quantity,
            )
            order_summary += (
                f"{item.items.product_name}\n"
                f"  Qty: {item.quantity}    "
                f"Price: R{item.items.price:.2f}\n"
                f"  Subtotal: R{item.items.price * item.quantity:.2f}\n\n"
            )

        subject = "Your SwiftBasket Invoice & Payment Instructions"
        message = create_email_message(user, order_summary, total_price, order)

        email = EmailMessage(
            subject,
            message,
            "josedjango@gmail.com",
            [user.email]
        )
        email.send(fail_silently=False)

        # Delete cart
        cart_items.delete()

        return redirect("buyer_home")

    return render(request, "online_store/checkout.html",
                  {"cart_items": cart_items,
                   "total_price": total_price})
