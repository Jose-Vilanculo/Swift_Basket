from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from online_store.views.auth_views import (
    register_buyer,
    register_vendor,
    login_vendor,
    login_buyer,
    register_login,
    logout_user,
)

from online_store.views.store_views import (
    seller_home,
    create_store,
    update_store,
    delete_store,
)

from online_store.views.product_views import (
    home,
    view_product,
    buyer_home,
    update_product,
    delete_product,
    create_product,
)

from online_store.views.cart_views import (
    add_item_to_cart,
    view_cart,
    merge_cart,
    update_cart,
)

from online_store.views.order_views import (
    user_orders_view,
    checkout,
)

from online_store.views.review_views import (
    create_review,
    product_reviews_view,
)

from online_store.views.password_reset_views import (
    reset_user_password,
    reset_password,
    send_password_reset,
)

urlpatterns = [
    # URL pattern for the home page
    path("", home, name="home"),

    # URL pattern to register a vendor
    path("shop/seller/register/", register_vendor, name="register_vendor"),

    # URL pattern for logging-in vendor users
    path("shop/seller/login/", login_vendor, name="login_vendor"),

    # URL pattern to register a buyer
    path("shop/shopper/register/", register_buyer, name="register_buyer"),

    # URL pattern for logging-in buyer users
    path("shop/buyer/login/", login_buyer, name="login_buyer"),

    # URL pattern for logging-out a user
    path("shop/logout/", logout_user, name="logout_user"),

    # URL pattern for register or login view
    path("shop/", register_login, name="register_login"),

    # URL pattern for Vendors home page
    path("seller/dashboard/", seller_home, name="seller_home"),

    # URL pattern for Buyers home page
    path("buyer/dashboard/", buyer_home, name="buyer_home"),

    # URL pattern for viewing a product in store
    path("shop/product/<uuid:pk>/", view_product, name="view_product"),

    # URL pattern for creating a new store
    path("shop/store/create/", create_store, name="create_store"),

    # URL pattern for deleting a store
    path("shop/store/<uuid:pk>/delete/", delete_store, name="delete_store"),

    # URL pattern for updating a store
    path("shop/store/<uuid:pk>/update/", update_store, name="update_store"),

    # URL pattern for creating a product
    path("shop/product/create/", create_product, name="create_product"),

    # URL pattern for deleting a product
    path(
        "shop/product/<uuid:pk>/delete/",
        delete_product,
        name="delete_product"
    ),

    # URL pattern for updating products
    path(
        "shop/product/<uuid:pk>/update/",
        update_product,
        name="update_product"
    ),

    # URL pattern for adding items to un-authenticated users cart
    path("shop/product/", add_item_to_cart, name="add_item_to_cart"),

    # URL pattern to view users cart
    path("shop/cart/", view_cart, name="view_cart"),

    # URL pattern for updating cart
    path("shop/cart/update/", update_cart, name="update_cart"),

    # URL pattern for merging cart
    path("shop/cart/merge_cart", merge_cart, name="merge_cart"),

    # URL pattern for checking out your cart
    path("shop/checkout/", checkout, name="checkout"),

    # URL pattern for creating a review
    path(
        "shop/product/<uuid:pk>/create_review/",
        create_review,
        name="create_review"
    ),

    # URL pattern for viewing product reviews
    path(
        "shop/product/<uuid:pk>/reviews/",
        product_reviews_view,
        name="product_reviews_view"
    ),

    # URL pattern to view user orders
    path("shop/my_orders/", user_orders_view, name="user_orders_view"),

    # URL pattern for validating resetting user password
    path(
        "swift_basket/reset_password/<str:token>/",
        reset_user_password,
        name="password_reset"
    ),

    # URL pattern send reset password link
    path(
        "shop/forgot_password/",
        send_password_reset,
        name="send_password_reset"
    ),

    # URL pattern to resetting user password
    path("shop/create_new_password", reset_password, name="reset_password"),
]


# only in development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
