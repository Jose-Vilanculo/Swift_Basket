from rest_framework import viewsets, serializers
from django.db.models import Q
from online_store.models import Product, ProductImage
from online_store.api.serializers import ProductSerializer
from online_store.api.permissions import IsOwnerVendorOrReadOnly


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsOwnerVendorOrReadOnly]
    http_method_names = ["get", "post", "patch", "delete"]

    def perform_create(self, serializer):

        user = self.request.user

        # Ensure that user is a Vendor
        if user.role != "vendor":
            raise serializers.ValidationError("Only Vendors can create products")
        
        # Ensure that users own a store
        if not hasattr(user, "store"):
            raise serializers.ValidationError(
                "Create a store before adding products"
            )
        
        # Ensure user cant make duplicate products
        product_name = self.request.data.get("product_name")
        if Product.objects.filter(
            store=user.store,
            product_name=product_name
        ).exists():
            raise serializers.ValidationError(
                "You already have an item with this product name."
            )

        product = serializer.save(store=self.request.user.store)

        # get list of images from request and create multiple product images
        images = self.request.FILES.getlist("images")
        main_index = int(
            self.request.data.get("main_image_index", 0)
        )

        for index, image in enumerate(images):
            ProductImage.objects.create(
                product=product,
                image=image,
                is_main=index == main_index
            )

    def get_queryset(self):
        """
        Optomize database query
        """

        queryset = (
            Product.objects
            .select_related("category", "store")
            .prefetch_related("images")
        )

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(product_name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search)
            )

        # get category by slug
        category__slug = self.request.query_params.get("category")
        if category__slug:
            queryset = queryset.filter(category__slug=category__slug)


        # get items according to an order
        ordering = self.request.query_params.get("ordering")
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

