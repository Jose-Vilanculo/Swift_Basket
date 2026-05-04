from online_store.models import (
    CustomUser,
    Store,
    Product,
    Category,
    ProductVariant,
    ProductImage,
    Cart,
    CartItem,
    Review,
    Order,
    OrderItem,
    ResetToken
)
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "role",
            "password",
            "profile_image"
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"
        read_only_fields = ["store_id", "owner"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):

    subcategories = serializers.SerializerMethodField()

    def get_subcategories(self, obj):
        return CategorySerializer(
            obj.subcategories.all(),
            many=True,
            context=self.context
        ).data

    class Meta:
        model = Category
        fields = ["id", "name", "parent", "subcategories"]


class ProductSerializer(serializers.ModelSerializer):

    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["product_id", "slug", "created_at", "updated_at"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):

    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source="product",
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class ResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetToken
        fields = ["id", "user", "token", "expiry_date", "used"]
        read_only_fields = ["token"]
