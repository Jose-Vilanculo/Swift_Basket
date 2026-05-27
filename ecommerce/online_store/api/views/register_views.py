from rest_framework import generics
from online_store.models import CustomUser, Cart
from online_store.api.serializers import UserSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):

        user = serializer.save()

        # create carts for customers upon registration
        if user.role == "buyer":
            Cart.objects.get_or_create(
                user=user
            )
