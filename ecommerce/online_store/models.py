from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import uuid


class Store(models.Model):
    """Model that defines a user Store

    Args:
        - store_id: UUIDField for a unique store id
        - owner: OneToOneField linked to a user
        - store_name: CharField for the store's name
        - description: TextField for the store's description

    Returns:
        _str_: name of the store
    """
    store_id = models.UUIDField(primary_key=True,
                                default=uuid.uuid4,
                                editable=False) 
    owner = models.OneToOneField(User,
                                 on_delete=models.CASCADE,
                                 related_name="store"
                                 )
    store_name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.store_name


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
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    image = models.ImageField(
        upload_to="product_images/",
        default="product_images/default.webp",
        null=True,
        blank=True
    )
    description = models.TextField()

    def __str__(self):
        return self.product_name


class Cart(models.Model):
    """
    Represents a shopping cart for a user.

    Attributes:
        user (User): The user who owns the cart.
        date_created_at (datetime): Timestamp when the cart was created.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
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
    items = models.ForeignKey("Product",
                              on_delete=models.CASCADE,
                              null=False,
                              blank=False
                              )
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.items.product_name}"


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
        User,
        related_name="reviews",
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
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
    user = models.ForeignKey(User,
                             related_name="order",
                             on_delete=models.CASCADE
                             )
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    date_created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Oder #{self.id} by {self.user}"


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
                              related_name="order_item",
                              on_delete=models.CASCADE)
    product = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.product_name}"


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
