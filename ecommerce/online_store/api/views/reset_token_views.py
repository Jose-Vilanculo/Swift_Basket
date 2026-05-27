from hashlib import sha1
from datetime import timedelta
import secrets

import os
from dotenv import load_dotenv

from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, status

from online_store.models import ResetToken


User = get_user_model()
load_dotenv()


# -----------------------------
# Helpers
# -----------------------------

def build_email(user, reset_url):
    """
    Builds password reset email.
    """

    subject = "Password Reset"

    body = f"""
Hi {user.username},

You requested a password reset.

Click the link below to reset your password:

{reset_url}

This link expires in 5 minutes.

If you did not request this, you can ignore this email.
"""

    return EmailMessage(
        subject=subject,
        body=body,
        from_email=os.environ.get('EMAIL_HOST_USER'),
        to=[user.email]
    )


def generate_reset_token(user):
    """
    Creates and stores reset token.
    """

    raw_token = secrets.token_urlsafe(32)

    hashed_token = sha1(
        raw_token.encode()
    ).hexdigest()

    expiry_date = timezone.now() + timedelta(minutes=5)

    ResetToken.objects.create(
        user=user,
        token=hashed_token,
        expiry_date=expiry_date
    )

    return raw_token


# -----------------------------
# Request Password Reset
# -----------------------------

class PasswordResetRequestView(APIView):

    permission_classes = []

    def post(self, request):

        email = request.data.get("email")

        if not email:

            raise serializers.ValidationError(
                {
                    "email":
                    "Email is required."
                }
            )

        try:

            user = User.objects.get(email=email)

            token = generate_reset_token(user)

            base_url = os.environ.get('BASE_URL')

            # frontend reset url
            reset_url = (
                f"{base_url}reset-password/"
                f"{token}"
            )

            email_message = build_email(
                user,
                reset_url
            )

            email_message.send()

        except User.DoesNotExist:

            # prevent email enumeration
            pass

        return Response(
            {
                "message":
                "If an account exists, a reset email was sent."
            },
            status=status.HTTP_200_OK
        )


# -----------------------------
# Verify Reset Token
# -----------------------------

class VerifyResetTokenView(APIView):

    permission_classes = []

    def post(self, request):

        token = request.data.get("token")

        if not token:

            raise serializers.ValidationError(
                {
                    "token":
                    "Token is required."
                }
            )

        hashed_token = sha1(
            token.encode()
        ).hexdigest()

        try:

            reset_token = ResetToken.objects.get(
                token=hashed_token,
                used=False
            )

        except ResetToken.DoesNotExist:

            return Response(
                {
                    "valid": False,
                    "message": "Invalid token."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if reset_token.expiry_date < timezone.now():

            return Response(
                {
                    "valid": False,
                    "message": "Token expired."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "valid": True
            },
            status=status.HTTP_200_OK
        )


# -----------------------------
# Confirm Password Reset
# -----------------------------

class PasswordResetConfirmView(APIView):

    permission_classes = []

    def post(self, request):

        token = request.data.get("token")
        password = request.data.get("password")
        password_conf = request.data.get("password_conf")

        # validate required fields
        if not token:

            raise serializers.ValidationError(
                {
                    "token":
                    "Token is required."
                }
            )

        if not password:

            raise serializers.ValidationError(
                {
                    "password":
                    "Password is required."
                }
            )

        if password != password_conf:

            raise serializers.ValidationError(
                {
                    "password":
                    "Passwords do not match."
                }
            )

        hashed_token = sha1(
            token.encode()
        ).hexdigest()

        try:

            reset_token = ResetToken.objects.get(
                token=hashed_token,
                used=False
            )

        except ResetToken.DoesNotExist:

            raise serializers.ValidationError(
                {
                    "token":
                    "Invalid token."
                }
            )

        # check expiry
        if reset_token.expiry_date < timezone.now():

            raise serializers.ValidationError(
                {
                    "token":
                    "Token expired."
                }
            )

        # update password
        user = reset_token.user

        user.set_password(password)
        user.save()

        # invalidate token
        reset_token.used = True
        reset_token.save()

        return Response(
            {
                "message":
                "Password reset successful."
            },
            status=status.HTTP_200_OK
        )
