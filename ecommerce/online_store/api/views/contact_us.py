import os
from dotenv import load_dotenv
from django.core.mail import send_mail
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

    message = f"""
Name: {data['name']}
Email: {data['email']}
Phone: {data.get('phone', 'Not provided')}

Message:
{data['comment']}
"""

    send_mail(
        subject=f"New Contact Form Submission from {data['name']}",
        message=message,
        from_email=None,
        recipient_list=[os.environ.get('EMAIL_RECIPIENT')],
        fail_silently=False,
    )

    return Response(
        {"message": "Email sent successfully"},
        status=status.HTTP_200_OK,
    )