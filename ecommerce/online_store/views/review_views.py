from online_store.models import Review, OrderItem, Product
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404


def create_review(request, pk):
    """
    Handles the creation of a product review by a user.

    Args:
        request: The HTTP request object.
        pk: The primary key of the product being reviewed.

    Returns:
        Redirects to the review page or renders the review
        form with product context.
    """
    product = get_object_or_404(Product, pk=pk)
    user = request.user

    if Review.objects.filter(user=user, product=product).exists():
        messages.error(request, "You have already submitted a review.")
        return redirect("product_reviews_view", pk=product.product_id)

    # Check if the user has ordered this product
    has_purchased = OrderItem.objects.filter(
        order__user=user, product=product).exists()

    if request.method == "POST":
        rating = int(request.POST["rating"])
        comment = request.POST["comment"]
        Review.objects.create(
            user=user,
            product=product,
            rating=rating,
            comment=comment,
            is_verified=has_purchased
        )
        messages.success(request, "Your review has been submitted.")
        return redirect("product_reviews_view", pk=product.product_id)

    return render(request, "online_store/create_review.html",
                  {"product": product})


def product_reviews_view(request, pk):
    """
    Displays the list of reviews for a given product.

    Args:
        request: The HTTP request object.
        pk: The primary key of the product whose reviews are to be shown.

    Returns:
        Renders the product_reviews.html template with product and its reviews.
    """
    product = get_object_or_404(Product, pk=pk)
    reviews = Review.objects.filter(product=product)

    return render(request, "online_store/product_reviews.html", {
        "product": product,
        "reviews": reviews
    })
