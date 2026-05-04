from .models import Cart, CartItem


def cart_context(request):
    cart_items_count = 0

    if request.user.is_authenticated:
        try:
            cart = (Cart.objects.get(user=request.user))
            cart_items_count = sum(
                item.quantity for item in cart.cartitem_set.all())
        except Cart.DoesNotExist:
            pass
    else:
        session_cart = request.session.get("cart", {})
        cart_items_count = sum(session_cart.values())

    return {
        "cart_items_count": cart_items_count,
        }
