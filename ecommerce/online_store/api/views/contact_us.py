import traceback
from ..orders.utils import send_contact_form_email
import requests
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from online_store.api.serializers import ContactSerializer

load_dotenv()


@api_view(["POST"])
def contact(request):
    serializer = ContactSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    try:
        send_contact_form_email(data)
    except requests.exceptions.RequestException:
        traceback.print_exc()
        return Response(
            {"error": "Failed to send email. Please try again later."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(
        {"message": "Email sent successfully"},
        status=status.HTTP_200_OK,
    )