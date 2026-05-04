from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from .models import Store, Product


User = get_user_model()


class StoreForm(forms.ModelForm):
    """Form for creating a new store

    Includes fields for store_name and description
    """
    class Meta:
        model = Store
        fields = ["store_name", "description", "store_image"]


class ProductForm(forms.ModelForm):
    """Form for creating a new product

    Args:
        forms (_type_): _description_
    """
    class Meta:
        model = Product
        fields = ["product_name", "price", "description", "brand", "stock"]


class RegisterUserForm(UserCreationForm):
    """
    Form for registering a new user account.

    Includes fields for username, email, and password confirmation.
    Inherits from Django's built-in UserCreationForm.
    """
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password1", "password2"]

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                "An account with this email already exists."
            )
        return email
