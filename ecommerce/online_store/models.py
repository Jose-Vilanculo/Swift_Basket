from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from django.conf import settings
import uuid


class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.

    Fields:
        - role: Defines the user's role ('buyer' or 'vendor')
        - profile_image: profile picture and background images,
          for users profiles
        - phone_number: users telephone number
        - gender: Defines the users Gender ('male', 'female' or 'other')

    Methods:
        - is_buyer(): Returns True if user is a buyer
        - is_vendor(): Returns True if user is a vendor
        - save(): Overrides save to enforce assigning a group
        - assign_group(): Automatically assigns user to group based on role
    """
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('vendor', 'Vendor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    profile_image = models.ImageField(
        upload_to="profile_images/",
        null=True,
        blank=True
    )
    phone_number = models.CharField(max_length=20, blank=True)
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)

    def is_buyer(self):
        return self.role == 'buyer'

    def is_vendor(self):
        return self.role == 'vendor'

    def assign_group(self):
        if self.role:
            group, _ = Group.objects.get_or_create(name=self.role.capitalize())
            self.groups.clear()
            self.groups.add(group)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.assign_group()


class Address(models.Model):
    """Model that defines a users address

    Args:
        models (_type_): _description_

    Raises:
        ValidationError: _description_

    Returns:
        _type_: _description_
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="address"
    )
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="South Africa")
    
    def __str__(self):
        return f"{self.user.name} - {self.street}"


class Store(models.Model):
    """Model that defines a user Store

    Args:
        - store_id: UUIDField for a unique store id
        - owner: OneToOneField linked to a user
        - store_name: CharField for the store's name
        - description: TextField for the store's description
        -store_image: ImageField to store a stores profile image

    Returns:
        _str_: name of the store
    """
    store_id = models.UUIDField(primary_key=True,
                                default=uuid.uuid4,
                                editable=False)
    owner = models.OneToOneField(settings.AUTH_USER_MODEL,
                                 on_delete=models.CASCADE,
                                 related_name="store"
                                 )
    store_name = models.CharField(max_length=255)
    description = models.TextField()
    store_image = models.ImageField(
        upload_to="store_images/",
        null=True,
        blank=True
    )
    store_banner = models.ImageField(
        upload_to="store_banners/",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.store_name

    def save(self, *args, **kwargs):
        if self.owner.role != "vendor":
            raise ValidationError("Only vendors can own Stores")
        super().save(*args, **kwargs)


class Product(models.Model):
    """
    Represents a product listed in a vendor's store.

    Attributes:
        store (Store): The store the product belongs to.
        product_id (UUID): Unique identifier for the product.
        product_name (str): Name of the product.
        price (Decimal): Price of the product.
        image (Image): Optional image of the product.
        description (str): Detailed product description.
    """
    store = models.ForeignKey(
        "Store",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="products"
    )
    product_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    product_name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    description = models.TextField()
    category = models.ForeignKey(
        "Category",
        on_delete=models.SET_NULL,
        null=True,
        related_name="products"
    )
    brand = models.CharField(max_length=255, default="generic")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.product_name) or "product"
            slug = base_slug
            counter = 1

            while (
                Product.objects
                .filter(slug=slug)
                .exclude(pk=self.pk)
                .exists()
            ):
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.product_name

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["category"]),
            models.Index(fields=["slug"]),
        ]

    @property
    def is_available(self):
        return self.stock > 0   # returns boolean according to stock


class Category(models.Model):
    """Model that defines a products category

    Args:
        - name: Charfield for the name of the category
        -parent: the parent category if the object is a sub category

    Returns:
        __str: name of the category
    """
    name = models.CharField(max_length=255, unique=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subcategories"
    )
    slug = models.SlugField(unique=True, blank=True)
    icon = models.ImageField(
        upload_to="category_icons/",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):

        if not self.slug:
            base_slug = slugify(self.name) or "category"
            slug = base_slug
            counter = 1

            while (
                Category.objects
                .filter(slug=slug)
                .exclude(pk=self.pk)
                .exists()
            ):
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        # normalize to prevent duplicates
        self.name = self.name.strip().title()

        super().save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["parent"]),
        ]


class ProductVariant(models.Model):
    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE, related_name="variants"
    )
    attributes = models.JSONField(default=dict)
    stock = models.PositiveIntegerField(default=0, blank=False, null=False)
    additional_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )


    @property
    def final_price(self):
        return (
            self.product.price + self.additional_price
        )


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(upload_to="product_images/")
    is_main = models.BooleanField(default=False)

    def save(self, *args, **kwargs):

        # updates is_main from previous to the current image
        if self.is_main:
            ProductImage.objects.filter(
                product=self.product,
                is_main=True
            ).exclude(pk=self.pk).update(is_main=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.product.product_name}"
    
    @property
    def main_image(self):
        return self.images.filter(is_main=True).first()


class Cart(models.Model):
    """
    Represents a shopping cart for a user.

    Attributes:
        user (User): The user who owns the cart.
        date_created_at (datetime): Timestamp when the cart was created.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart"
    )
    date_created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}'s Cart"


class CartItem(models.Model):
    """
    Represents an item in a user's shopping cart.

    Attributes:
        cart (Cart): The cart to which the item belongs.
        items (Product): The product being added to the cart.
        quantity (int): The number of units of the product.
    """
    cart = models.ForeignKey("Cart",
                             on_delete=models.CASCADE,
                             null=False,
                             blank=False
                             )
    product_variant = models.ForeignKey("ProductVariant",
                                on_delete=models.CASCADE,
                                null=False,
                                blank=False
                                )
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product_variant.product.product_name}"


class Review(models.Model):
    """
    Represents a product review made by a user.

    Attributes:
        user (User): The user who left the review.
        product (Product): The product being reviewed.
        rating (int): Star rating from 1 to 5.
        comment (str): Review text.
        date_created_at (datetime): When the review was posted.
        is_verified (bool): Whether the purchase is verified.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="reviews",
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE,
        related_name="review",
    )
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    title=models.CharField(max_length=255)
    comment = models.TextField()
    date_created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"],
                name="unique_user_product_review"
            )
        ]

    def __str__(self):
        return f"{self.rating} stars for {self.product.product_name}"


class Order(models.Model):
    """
    Represents an order placed by a user.

    Attributes:
        user (User): The user who placed the order.
        total_price (Decimal): Total cost of the order.
        date_created_at (datetime): Time the order was created.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="orders",
        on_delete=models.CASCADE
    )
    shipping_full_name = models.CharField(max_length=255)
    shipping_phone = models.CharField(max_length=20)
    shipping_street = models.CharField(max_length=255)
    shipping_city = models.CharField(max_length=100)
    shipping_province = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=10)
    shipping_country = models.CharField(
        max_length=100,
        default="South Africa"
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    date_created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user}"


class OrderItem(models.Model):
    """
    Represents a single item in an order.

    Attributes:
        order (Order): The order the item belongs to.
        product (str): Name of the product ordered.
        quantity (int): Quantity of the product.
        price (Decimal): Price for the ordered quantity.
    """
    order = models.ForeignKey("Order",
                              related_name="order_items",
                              on_delete=models.CASCADE)
    product_variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product_variant}"


class ResetToken(models.Model):
    """
    Represents a password reset token issued to a user.

    Attributes:
        user (User): The user the token is for.
        token (str): Encrypted reset token string.
        expiry_date (datetime): When the token expires.
        used (bool): Whether the token has been used already.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    token = models.CharField(max_length=500)
    expiry_date = models.DateTimeField()
    used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user}'s reset-token: {self.token}"
