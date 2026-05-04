from online_store.models import Store, Product
from online_store.forms import ProductForm
from django.db.models import Avg
from online_store.functions.tweet import Tweet
from django.shortcuts import render, redirect, get_object_or_404


def home(request):
    """home screen that displays all the products

    Args:
        request

    Returns:
        home screen that displays all the products on the website
    """
    is_vendor = False
    is_buyer = False
    if request.user.is_authenticated:
        is_vendor = request.user.groups.filter(name="Vendors").exists()
        is_buyer = request.user.groups.filter(name="Buyers").exists()
        if is_vendor:
            return redirect("seller_home")
        elif is_buyer:
            return redirect("buyer_home")

    products = Product.objects.all()
    context = {"products": products,
               "page_title": "Home",
               }
    return render(request, "online_store/home.html", context)


def view_product(request, pk):
    """View for specific product

    Args:
        request
        pk: primary key to a specific product

    Returns:
        page with information on a specific product
    """
    user = request.user
    if user.has_perm("online_store.view_product"):
        try:
            product = Product.objects.annotate(
                avg_rating=Avg("review__rating")).get(pk=pk)
            return render(request, "online_store/product_seller.html",
                          {"product": product}
                          )
        except (ValueError, Product.DoesNotExist):
            return render(request, "online_store/product_not_found.html",
                          status=404)
    else:
        try:
            product = Product.objects.annotate(
                avg_rating=Avg("review__rating")).get(pk=pk)
            return render(request, "online_store/product_buyer.html",
                          {"product": product}
                          )
        except (ValueError, Product.DoesNotExist):
            return render(request, "online_store/product_not_found.html",
                          status=404)


def buyer_home(request):
    """
    Renders the home page for buyers, displaying all products
    with average ratings.

    Args:
        request: The HTTP request object.

    Returns:
        Rendered template with product list and page title.
    """
    products = Product.objects.annotate(avg_rating=Avg("review__rating"))
    context = {"products": products,
               "page_title": "Home",
               }
    return render(request, "online_store/home.html", context)


def update_product(request, pk):
    """
    Updates a product instance if the user has the required permission.

    Args:
        request: The HTTP request object.
        pk: Primary key of the product to be updated.

    Returns:
        Redirect to seller_home on success.
        Render product form template with errors otherwise.
    """
    user = request.user
    if user.has_perm("online_store.change_product"):
        product = get_object_or_404(Product, pk=pk)
        if request.method == "POST":
            form = ProductForm(request.POST, request.FILES, instance=product)
            if form.is_valid():
                product_name = form.cleaned_data["product_name"]
                store = product.store
                if not form.cleaned_data["image"]:
                    product.image = "product_images/default.webp"

                if Product.objects.filter(
                    product_name=product_name,
                    store=store
                ).exclude(pk=product.pk).exists():
                    form.add_error(
                        "product_name",
                        "Another product with this same name already exists."
                        )
                    return render(request,
                                  "online_store/product_form.html",
                                  {"form": form}
                                  )

                product = form.save(commit=False)
                product.save()
                return redirect("seller_home")
        else:
            form = ProductForm(instance=product)
        return render(request, "online_store/product_form.html",
                      {"form": form})


def delete_product(request, pk):
    """
    Deletes a product instance if the user has the required permission.

    Args:
        request: The HTTP request object.
        pk: Primary key of the product to delete.

    Returns:
        Redirect to seller_home after deletion.
    """
    user = request.user
    if user.has_perm("online_store.delete_product"):
        product = get_object_or_404(Product, pk=pk)
        print(product)
        product.delete()
        return redirect("seller_home")


def create_product(request):
    """
    Allows a vendor to create a new product.

    Args:
        request: The HTTP request object.

    Returns:
        Rendered product form on GET or failed POST.
        Redirect to seller_home on successful creation.
    """
    user = request.user
    if user.has_perm("online_store.add_product"):
        if request.method == "POST":
            form = ProductForm(request.POST, request.FILES)
            if form.is_valid():
                product = form.save(commit=False)

                # check if product already exists
                product_name = form.cleaned_data["product_name"]
                store = Store.objects.get(owner=request.user)
                if Product.objects.filter(
                    product_name=product_name,
                    store=store
                ).exclude(pk=product.pk).exists():
                    form.add_error(
                        "product_name",
                        "Another product with this same name already exists."
                        )
                    return render(request,
                                  "online_store/product_form.html",
                                  {"form": form}
                                  )

                # finish creating product and save
                try:
                    product.store_id = str(request.user.store.store_id)
                    product.save()

                except AttributeError:
                    form.add_error(
                        None,
                        "You do not have a store assigned to your account."
                        )
                    return render(request,
                                  "online_store/product_form.html",
                                  {"form": form}
                                  )

                # create tweet
                # image = form.cleaned_data.get("image")
                text = f'''New from {product.store.store_name} on Swiftbasket!
{product.product_name}:
{product.description}
#SwiftBasket #NowAvailable'''
                tweet_client = Tweet()
                tweet_client.make_tweet(text=text)

                return redirect("seller_home")

        else:
            form = ProductForm()
        return render(request,
                      "online_store/product_form.html",
                      {"form": form})
