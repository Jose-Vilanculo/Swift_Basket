from online_store.models import Product, Store
from django.contrib import messages
from online_store.forms import StoreForm
from online_store.functions.tweet import Tweet
from django.shortcuts import render, redirect, get_object_or_404


def seller_home(request):
    """
    Renders the seller home page with store and product info
    for the logged-in vendor.

    Args:
        request: The HTTP request object.

    Returns:
        Rendered template with store and associated products.
    """
    user = request.user
    if user.has_perm("online_store.view_store"):
        try:
            store = user.store
            products = Product.objects.filter(store=store)
        except Store.DoesNotExist:
            store = None
            products = None

        context = {
            "store": store,
            "products": products,
            "page_title": "Seller home",
        }
        return render(request, "online_store/seller_home.html", context)

    messages.error(request, "You do not have a vendors account. Register now.")
    return redirect("register_vendor")


def create_store(request):
    """
    Allows a vendor to create a new store.

    Args:
        request: The HTTP request object.

    Returns:
        Rendered store form on GET or failed POST.
        Redirect to seller_home on successful creation.
    """
    user = request.user
    if user.has_perm("online_store.add_store"):
        if request.method == "POST":
            form = StoreForm(request.POST)
            if form.is_valid():
                store = form.save(commit=False)
                store.owner = request.user
                store.save()

                # create tweet
                text = f'''🛍️ New on SwiftBasket!
Store Name: {store.store_name}
{store.description}
#ShopSwift #SwiftBasketLaunch'''
                tweet_client = Tweet()
                tweet_client.make_tweet(text=text)
                return redirect("seller_home")
            else:
                return render(request,
                              "online_store/store_form.html",
                              {"form": form}
                              )
        else:
            form = StoreForm()

        return render(request,
                      "online_store/store_form.html",
                      {"form": form})


def update_store(request, pk):
    """
    Updates a store instance if the user has the required permission.

    Args:
        request: The HTTP request object.
        pk: Primary key of the store to be updated.

    Returns:
        Redirect to seller_home on success.
        Render store form template otherwise.
    """
    user = request.user
    if user.has_perm("online_store.change_store"):
        store = get_object_or_404(Store, pk=pk)
        if request.method == "POST":
            form = StoreForm(request.POST, instance=store)
            if form.is_valid():
                store = form.save(commit=False)
                store.save()
                return redirect("seller_home")
        else:
            form = StoreForm(instance=store)
        return render(request, "online_store/store_form.html",
                      {"form": form})


def delete_store(request, pk):
    """
    Deletes a store instance if the user has the required permission.

    Args:
        request: The HTTP request object.
        pk: Primary key of the store to delete.

    Returns:
        Redirect to seller_home after deletion.
    """
    user = request.user
    if user.has_perm("online_store.delete_store"):
        store = get_object_or_404(Store, pk=pk)
        store.delete()
        return redirect("seller_home")
