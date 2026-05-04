from rest_framework import viewsets
from online_store.models import Category
from rest_framework.permissions import AllowAny
from online_store.api.serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
