from django.urls import path
from .views import (
    view_store, view_stores, review_view, view_product, add_store, add_product
)

urlpatterns = [

    # URL path for viewing all stores via API
    path("stores/", view_stores),

    # URL path for viewing a specific store via API
    path("store/<uuid:pk>/", view_store),

    # URL pattern for viewing a specific product via API
    path("product/<uuid:pk>/", view_product),

    # URL path for viewing a reviews from a specific product via API
    path("product/<uuid:pk>/reviews/", review_view),

    # URL path for creating a store via API
    path("create/store/", add_store),

    # URL pattern for creating a product via API
    path("create/product/", add_product)
]
