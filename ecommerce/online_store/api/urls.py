from django.urls import path
from rest_framework.routers import DefaultRouter
from online_store.api.views.product_views import ProductViewSet
from online_store.api.views.store_views import StoreViewSet
from online_store.api.views.category_views import CategoryViewSet
from online_store.api.views.product_image_views import ProductImageViewSet
from online_store.api.views.product_variant_views import ProductVariantViewset
from online_store.api.views.user_views import UserViewSet
from online_store.api.views.register_views import RegisterView
from online_store.api.views.cart_items_views import CartItemViewset
from online_store.api.views.cart_views import CartViewset
from online_store.api.views.order_views import OrderViewset
from online_store.api.views.order_items_views import OrderItemViewset
from online_store.api.views.reviews_views import ReviewsViewset
from online_store.api.views.address_views import AddressViewset


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from online_store.api.views.reset_token_views import (
    PasswordResetRequestView,
    VerifyResetTokenView,
    PasswordResetConfirmView
)


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'stores', StoreViewSet, basename='store')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(
    r'product-images', ProductImageViewSet, basename='product-image'
)
router.register(
    r'product-variants', ProductVariantViewset, basename='product-variants'
)
router.register(r'users', UserViewSet, basename='user')
router.register(
    r'cart-items', CartItemViewset, basename='cart-items'
)
router.register(r'cart', CartViewset, basename='cart')
router.register(r'order', OrderViewset, basename='order')
router.register(r'order-items', OrderItemViewset, basename='order-items')
router.register(r'reviews', ReviewsViewset, basename='reviews')
router.register(r'address', AddressViewset, basename='address')

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path(
        "token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair"
    ),
    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),
        path(
        "password-reset/request/",
        PasswordResetRequestView.as_view()
    ),

    path(
        "password-reset/verify/",
        VerifyResetTokenView.as_view()
    ),

    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view()
    ),

] + router.urls
