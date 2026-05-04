import secrets
from online_store.models import User, ResetToken
from django.contrib import messages
from django.core.mail import EmailMessage
from datetime import datetime, timedelta
from django.shortcuts import render, redirect
from hashlib import sha1


# ---email---

def build_email(user, reset_url):
    """
    Builds an email message for the user with a password reset link.

    Args:
        user: The user requesting the password reset.
        reset_url: The reset URL to be included in the email.

    Returns:
        An EmailMessage object ready to be sent.
    """
    subject = "Password Reset"
    user_email = user.email
    domain_email = "josedjango2001@gmail.com"
    body = f'''Hi {user.username},

You requested a password reset. Click the link below to rest your password:

{reset_url}

This link will expire in 5 minutes.

If you didn't request this, you can ignore this email.
'''
    return EmailMessage(subject, body, domain_email, [user_email])


def generate_reset_url(user):
    """
    Generates a password reset URL for the given user
    and saves a token to the database.

    Args:
        user: The user who requested the password reset.

    Returns:
        A full reset URL containing a secure token.
    """
    domain = "http://127.0.0.1:8000/"
    app_name = "swift_basket"
    url = f"{domain}{app_name}/reset_password/"
    token = str(secrets.token_urlsafe(16))
    expiry_date = datetime.now() + timedelta(minutes=5)   # last for 5min

    # Create and save token
    ResetToken.objects.create(
        user=user,
        token=sha1(token.encode()).hexdigest(),
        expiry_date=expiry_date
    )
    url += f"{token}/"
    return url


def send_password_reset(request):
    """
    Handles the password reset request: generates a token,
    sends email, and handles errors.

    Args:
        request: The HTTP request object.

    Returns:
        Renders the forgot password template with a success or error message.
    """
    if request.method == "POST":
        user_email = request.POST.get("email")

        try:
            user = User.objects.get(email=user_email)
            url = generate_reset_url(user)
            email = build_email(user, url)
            email.send()

            # Default fallback
            messages.success(
                request,
                "An email was sent to you with a password reset link."
            )
            return render(request, "online_store/forgot_your_password.html")

        except User.DoesNotExist:
            messages.error(request, "No account found with that email.")
            return render(request, "online_store/forgot_your_password.html")

    else:
        return render(request, "online_store/forgot_your_password.html")


# ---Reset password---

def reset_user_password(request, token):
    """
    Verifies the token from the reset link and displays
    the password reset form.

    Args:
        request: The HTTP request object.
        token: The reset token sent via email.

    Returns:
        Renders the password reset form with appropriate error
        if the token is invalid or expired.
    """
    try:
        hashed_token = sha1(token.encode()).hexdigest()
        user_token = ResetToken.objects.get(token=hashed_token)

        # Check if the token is expired
        if user_token.expiry_date.replace(tzinfo=None) < datetime.now():
            user_token.delete()
            return render(request, "online_store/password_reset.html", {
                "error": "This reset link has expired.",
                "token": token
            })

        # Store session data to use in actual password reset
        request.session["user"] = user_token.user.username
        request.session["token"] = token

        return render(request, "online_store/password_reset.html", {
            "user_token": user_token,
            "token": token
        })

    except ResetToken.DoesNotExist:
        user_token = None
        return render(request, "online_store/password_reset.html", {
            "error": "Invalid or expired reset token",
            "token": token
        })


def change_user_password(username, new_password):
    """
    Changes a user's password.

    Args:
        username: The username of the user.
        new_password: The new password to be set.

    Returns:
        None
    """
    user = User.objects.get(username=username)
    user.set_password(new_password)
    user.save()


def reset_password(request):
    """
    Validates and updates a user's password after token verification.

    Args:
        request: The HTTP request object.

    Returns:
        Redirects to the login page appropriate to the user group or
        renders the form again on error.
    """
    if request.method == "POST":
        username = request.session.get("user")
        token = request.session.get("token")

        if not username or not token:
            return render(request, "online_store/password_reset.html", {
                "errors": "Session expired or invalid reset link"
            })

        # Check if both passwords match
        password = request.POST.get("password")
        password_conf = request.POST.get("password_conf")
        if password == password_conf:
            change_user_password(username, password)

            # Delete reset token so it cant be reused
            ResetToken.objects.filter(
                token=sha1(token.encode()).hexdigest()
            ).delete()

            # Clear session data
            request.session.pop("user", None)
            request.session.pop("token", None)

            try:
                user = User.objects.get(username=username)
                if user.groups.filter(name="Vendors").exists():
                    return redirect("login_vendor")
                elif user.groups.filter(name="Buyers").exists():
                    return redirect("login_buyer")
            except User.DoesNotExist:
                pass
            print("no user")
            return redirect("home")   # default fallback

        else:
            return render(request, "online_store/password_reset.html", {
                "error": "Passwords do not match."
            })

    else:
        print("hello")
        return render(request, "online_store/password_reset.html")
