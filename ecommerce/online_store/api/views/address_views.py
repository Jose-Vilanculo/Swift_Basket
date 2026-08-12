from rest_framework import status, viewsets
from rest_framework.response import Response

from online_store.models import Address
from online_store.api.permissions import IsBuyer
from online_store.api.serializers import AddressSerializer


class AddressViewset(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsBuyer]
    http_method_names = ["get", "post"]

    def get_queryset(self):
        return Address.objects.filter(
            user=self.request.user
        )

    def create(self, request, *args, **kwargs):
        address = Address.objects.filter(
            user=request.user
        ).first()

        if address:
            serializer = self.get_serializer(
                address,
                data=request.data,
                partial=True
            )
            status_code = status.HTTP_200_OK
        else:
            serializer = self.get_serializer(
                data=request.data
            )
            status_code = status.HTTP_201_CREATED

        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(
            serializer.data,
            status=status_code
        )