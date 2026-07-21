from rest_framework import viewsets, serializers
from online_store.models import Review, Product
from online_store.api.serializers import ReviewSerializer
from online_store.api.permissions import IsOwnerBuyerOrReadOnly
from online_store.api.pagination import ReviewPagination
from django.db.models import Avg, Count
from rest_framework.response import Response


class ReviewsViewset(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerBuyerOrReadOnly]
    pagination_class = ReviewPagination
    

    def get_queryset(self):
        slug = self.request.query_params.get("slug")
        if slug:
            return Review.objects.filter(
                product__slug=slug
            )
        
        raise serializers.ValidationError(
            "This request is invalid."
        )
    

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        average_rating = queryset.aggregate(
            average=Avg("rating")
        )["average"] or 0

        review_count = queryset.count()

        # Get product id from slug
        slug = self.request.query_params.get("slug")
        if slug:
            product_id = Product.objects.filter(
                slug=slug
            ).values_list("product_id", flat=True).first()
        
        # Get users review if they already made one
        user_review = None

        if request.user.is_authenticated:
            review = queryset.filter(user=request.user).first()

            if review:
                user_review = ReviewSerializer(
                    review,
                    context={"request": request}
                ).data


        breakdown = (
            queryset.values("rating")
            .annotate(count=Count("id"))
        )

        rating_breakdown = {
            "5": 0,
            "4": 0,
            "3": 0,
            "2": 0,
            "1": 0,
        }

        for item in breakdown:
            rating_breakdown[str(item["rating"])] = item["count"]
            
        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response({
            "product_id": product_id,
            "average_rating": round(average_rating, 1),
            "review_count": review_count,
            "rating_breakdown": rating_breakdown,
            "has_reviewed": user_review is not None,
            "user_review": user_review,
            "results": serializer.data,
        })
