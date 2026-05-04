from django.http import HttpResponseBadRequest
from online_store.models import Product, Cart, CartItem
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib.auth.signals import user_logged_in


def add_item_to_cart(request):
    """
    Adds an item to the cart. Handles both authenticated (DB) and
    anonymous (session) users.

    Returns:
        Redirects to view_cart after adding item.
    """
    if request.user.is_authenticated:
        add_item_db_cart(request)
        return redirect("view_cart")

    try:
        quantity = int(request.POST.get("quantity", 1))
        if quantity < 1:
            return HttpResponseBadRequest("Invalid quantity")
    except ValueError:
        return HttpResponseBadRequest("Quantity must be at least 1")

    item = request.POST.get("item")
    if not item:
        return HttpResponseBadRequest("No item specified")

    cart = request.session.get("cart", {})

    item = str(item)
    if item in cart:
        cart[item] += quantity
    else:
        cart[item] = quantity

    request.session["cart"] = cart

    return redirect("view_cart")


def view_cart(request):
    """
    Displays the contents of the shopping cart.

    Returns:
        cart.html with items and total cost for both
        authenticated and session-based carts.
    """
    if request.user.is_authenticated:
        items = view_cart_db(request)
        return render(request, "online_store/cart.html", items)

    cart = request.session.get("cart", {})
    product_ids = [pid for pid in cart.keys() if pid]
    products = Product.objects.filter(product_id__in=product_ids)

    cart_items = []
    for product in products:
        qty = cart.get(str(product.product_id), 0)
        subtotal = product.price * qty
        cart_items.append({
            "product": product,
            "quantity": qty,
            "subtotal": subtotal
        })

    total = sum(item["subtotal"] for item in cart_items)

    return render(request, "online_store/cart.html",
                  {"cart_items": cart_items,
                   "total": total
                   })


@login_required
def view_cart_db(request):
    """
    Retrieves cart items from the database for the authenticated user.

    Returns:
        A dictionary with cart items and the total cost.
    """
    try:
        cart = Cart.objects.get(user=request.user)
    except Cart.DoesNotExist:
        cart = None

    cart_items = []
    total = 0

    if cart:
        items = CartItem.objects.filter(cart=cart).select_related('items')
        for item in items:
            product = item.items  # 'items' is the FK to Product
            quantity = item.quantity
            subtotal = product.price * quantity
            cart_items.append({
                "product": product,
                "quantity": quantity,
                "subtotal": subtotal
            })
        total = sum(item["subtotal"] for item in cart_items)

    items = {
        "cart_items": cart_items,
        "total": total
    }

    return items


@require_POST
@login_required
def add_item_db_cart(request):
    """
    Adds an item to the authenticated user's cart stored in the database.

    Returns:
        Redirects to view_cart after item is added or updated.
    """
    user = request.user
    product_id = request.POST.get("item")
    quantity = request.POST.get("quantity", 1)

    try:
        quantity = int(quantity)
        if quantity < 1:
            quantity = 1
    except ValueError:
        quantity = 1

    # Ensure product exists
    product = get_object_or_404(Product, product_id=product_id)

    # Get or create the cart for this user
    cart, _ = Cart.objects.get_or_create(user=user)

    # Get or create the cart item
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        items=product,
        defaults={"quantity": quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return redirect("view_cart")


def merge_cart(sender, request, **kwargs):
    """
    Merges session-based cart with the authenticated user's cart on login.

    Args:
        sender: The signal sender.
        request: The HTTP request object.
    """
    user = request.user
    if not user.groups.filter(name='Buyers').exists():
        return

    session_cart = request.session.get("cart", {})
    if not user.is_authenticated:
        return
    # get or create user cart
    cart, _ = Cart.objects.get_or_create(user=user)
    for product_id, quantity in session_cart.items():
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            continue

        cart_item, created = CartItem.objects.get_or_create(cart=cart,
                                                            items=product,
                                                            defaults={
                                                                "quantity":
                                                                quantity
                                                                }
                                                            )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

    request.session["cart"] = {}


user_logged_in.connect(merge_cart)


@require_POST
def update_cart(request):
    """
    Updates the quantity of items in the cart or removes them for both
    authenticated and anonymous users.

    Returns:
        Redirects to view_cart after performing updates.
    """
    if request.user.is_authenticated:
        update_db_cart(request)
        return redirect("view_cart")

    cart = request.session.get("cart", {})

    # Remove item
    product_id = request.POST.get("remove_item")
    if product_id:
        cart.pop(str(product_id), None)
        request.session["cart"] = cart
        return redirect("view_cart")

    # Update item quantity
    product_id = request.POST.get("update_item")
    if product_id:
        quantity = request.POST.get(f"quantity_{product_id}")
        try:
            quantity = int(quantity)
            if quantity > 0:
                cart[str(product_id)] = quantity
            else:
                cart.pop(str(product_id), None)  # Treat 0 as removal
        except (ValueError, TypeError):
            pass
        request.session["cart"] = cart
        return redirect("view_cart")

    # Fallback redirect
    return redirect("view_cart")


@require_POST
@login_required
def update_db_cart(request):
    """
    Updates or removes items from the authenticated user's
    cart stored in the database.

    Returns:
        Redirects to view_cart after performing updates.
    """
    cart, _ = Cart.objects.get_or_create(user=request.user)

    product_id = request.POST.get("remove_item")
    if product_id:
        try:
            item = CartItem.objects.get(cart=cart, items=product_id)
            item.delete()
        except CartItem.DoesNotExist:
            pass
        return redirect("view_cart")

    product_id = request.POST.get("update_item")
    if product_id:
        quantity = request.POST.get(f"quantity_{product_id}")
        try:
            quantity = int(quantity)
            if quantity > 0:
                item, created = CartItem.objects.get_or_create(
                    cart=cart,
                    items=product_id,
                    defaults={"quantity": quantity},
                )
                if not created:
                    item.quantity = quantity
                    item.save()
            else:
                # Quantity 0 - remove the item
                CartItem.objects.filter(cart=cart, items=product_id).delete()
        except (ValueError, TypeError):
            pass
        return redirect("view_cart")

    return redirect("view_cart")
