from django.urls import path
from rest_framework.routers import DefaultRouter
from online_store.api.views.product_views import ProductViewSet
from online_store.api.views.store_views import StoreViewSet
from online_store.api.views.category_views import CategoryViewSet
from online_store.api.views.product_image_views import ProductImageViewSet
from online_store.api.views.user_views import UserViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'stores', StoreViewSet, basename='store')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(
    r'product-images', ProductImageViewSet, basename='product-image'
)
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair"
    ),
    path(
        "api/token/refresh",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),

] + router.urls
