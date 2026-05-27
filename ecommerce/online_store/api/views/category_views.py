from rest_framework import viewsets
from online_store.models import Category
from online_store.api.permissions import IsAdminOrReadOnly
from online_store.api.serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


    def get_queryset(self):

        category__slug = self.request.query_params.get("category")

        # get category by slug
        if category__slug:
            return Category.objects.filter(slug=category__slug)
        
        # return all categories for menus
        return Category.objects.filter(parent=None)
