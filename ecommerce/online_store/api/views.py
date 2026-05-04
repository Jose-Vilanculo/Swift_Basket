from django.http import JsonResponse
from online_store.functions.tweet import Tweet
from online_store.models import Store, Review, Product
from online_store.api.serializers import (
    StoreSerializer, ReviewsSerializer, ProductSerializer
)
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.decorators import (
    api_view, authentication_classes, permission_classes
)


@api_view(["GET"])
def view_stores(request):
    """
    Retrieve a list of all stores.

    Method:
        GET

    Returns:
        200 OK: A JSON response containing a list of all stores.
        500 Internal Server Error: If an exception occurs,
        while fetching stores.
    """
    if request.method == "GET":
        try:
            stores = Store.objects.all()
            serializer = StoreSerializer(stores, many=True)
            return JsonResponse(data=serializer.data, safe=False)

        except Exception as e:
            return JsonResponse(
                {
                    "error": "An error occurred while retrieving stores",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["GET"])
def view_store(request, pk):
    """
    Retrieve a single store by its primary key (store_id).

    Method:
        GET

    Args:
        pk (int): The ID of the store to retrieve.

    Returns:
        200 OK: The serialized store data.
        404 Not Found: If no store with the given ID exists.
        500 Internal Server Error: If an unexpected error occurs.
    """

    if request.method == "GET":
        try:
            store = get_object_or_404(Store, store_id=pk)
            serializer = StoreSerializer(store)
            return JsonResponse(data=serializer.data, safe=False)

        except Exception as e:
            return JsonResponse(
                {
                    "error": "An error occurred when retrieving this store",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["GET"])
def view_product(request, pk):
    """
    Retrieve a product by its primary key (product_id).

    Method:
        GET

    Args:
        pk (int): The product ID.

    Returns:
        200 OK: Serialized product data.
        404 Not Found: If the product does not exist.
        500 Internal Server Error: On unexpected errors.
    """

    if request.method == "GET":
        try:
            products = Product.objects.filter(product_id=pk)
            # check if product exists
            if not products.exists():
                return JsonResponse(
                    {"detail": "Product not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            serializer = ProductSerializer(products, many=True)
            return JsonResponse(
                data=serializer.data,
                safe=False,
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return JsonResponse(
                {
                    "error": "Error occurred while retrieving the product",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["GET"])
def review_view(request, pk):
    """
    Retrieve all reviews for a given product.

    Method:
        GET

    Args:
        pk (int): The product ID to retrieve reviews for.

    Returns:
        200 OK: A list of reviews for the specified product.
        404 Not Found: If no reviews exist.
        500 Internal Server Error: On unexpected errors.
    """

    if request.method == "GET":
        try:
            review = Review.objects.filter(product=pk)
            if not review.exists():
                return JsonResponse(
                    {"detail": "No reviews found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            serializer = ReviewsSerializer(review, many=True)
            return JsonResponse(data=serializer.data, safe=False)

        except Exception as e:
            return JsonResponse(
                {"error": "Error occurred while retrieving reviews",
                 "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["POST"])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def add_store(request):
    """
    Create a new store for the authenticated user.

    Method:
        POST

    Permissions:
        - User must be authenticated.
        - User must have 'add_store' permission.
        - Only one store allowed per user.

    Request Data:
        JSON payload with store fields (e.g., name, description).

    Returns:
        201 Created: On successful creation.
        400 Bad Request: On validation error or duplicate store.
        403 Forbidden: If user lacks permission.
    """

    if request.method == "POST":

        if not request.user.has_perm("online_store.add_store"):
            return JsonResponse(
                {"detail": "You do not permission to add a store"},
                status=status.HTTP_403_FORBIDDEN
            )

        # check if user already has a store
        if Store.objects.filter(owner=request.user).exists():
            return JsonResponse(
                {"error": "Each user may only own one store"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = StoreSerializer(data=request.data)
        if serializer.is_valid():
            store = serializer.save(owner=request.user)

            # make tweet
            text = f'''🛍️ New on SwiftBasket!
Store Name: {store.store_name}
{store.description}
#ShopSwift #SwiftBasketLaunch'''
            tweet = Tweet()
            tweet.make_tweet(text=text)

            return JsonResponse(
                data=serializer.data,
                status=status.HTTP_201_CREATED
            )
        return JsonResponse(
            data=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def add_product(request):
    """
    Create a new product for the authenticated user's store.

    Method:
        POST

    Permissions:
        - User must be authenticated.
        - User must have 'add_store' permission (used as proxy here).

    Request Data:
        JSON payload with product details.

    Validations:
        - Checks that user owns a store.
        - Prevents duplicate product names within the same store.

    Returns:
        201 Created: On successful creation.
        400 Bad Request: If validation fails or no store exists.
        403 Forbidden: If user lacks permission.
    """

    if request.method == "POST":

        if not request.user.has_perm("online_store.add_store"):
            return JsonResponse(
                {"detail": "You do not have permission to create a product"},
                status=status.HTTP_403_FORBIDDEN
            )

        # check if user has a store
        if not Store.objects.filter(owner=request.user):
            return JsonResponse(
                {"detail": "User does not own a Store"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            # check if product already exists
            product_name = request.data.get("product_name")
            store = Store.objects.get(owner=request.user)
            if Product.objects.filter(
                product_name=product_name,
                store=store
            ).exists():
                return JsonResponse(
                    {"error": "Store already has a product with that name."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            store = Store.objects.get(owner=request.user)
            product = serializer.save(store=store)

            # make tweet
            text = f'''New from {product.store.store_name} on Swiftbasket!
{product.product_name}:
{product.description}
#SwiftBasket #NowAvailable'''
            tweet = Tweet()
            tweet.make_tweet(text=text)

            return JsonResponse(
                data=serializer.data,
                status=status.HTTP_201_CREATED
            )

        return JsonResponse(
            data=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
