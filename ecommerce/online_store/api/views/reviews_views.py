from rest_framework import viewsets, serializers
from online_store.models import Review
from online_store.api.serializers import ReviewSerializer
from online_store.api.permissions import IsOwnerBuyerOrReadOnly


class ReviewsViewset(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerBuyerOrReadOnly]
    

    def get_queryset(self):
        slug = self.request.query_params.get("slug")
        if slug:
            return Review.objects.filter(
                product__slug=slug
            )
        
        raise serializers.ValidationError(
            "This request is invalid."
        )
