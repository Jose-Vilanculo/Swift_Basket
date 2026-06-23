from online_store.models import (
    CustomUser,
    Address,
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
from django.db.models import Avg


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["user"]


class UserSerializer(serializers.ModelSerializer):

    address = AddressSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "role",
            "password",
            "profile_image",
            "gender",
            "phone_number",
            "address"
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
    

    def update(self, instance, validated_data):
        """Ensure that certain fields cant be updated"""

        protected_fields = [
            "username",
            "role",
            "gender",
            "email"
        ]

        for field in protected_fields:
            if field in validated_data:

                old_value = getattr(instance, field)
                new_value = validated_data[field]

                if old_value != new_value:
                    raise serializers.ValidationError(
                        f"{field} cannot be changed."
                    )
                
        return super().update(instance, validated_data)


    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return value

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
        fields = [
            "id",
            "name",
            "parent",
            "icon",
            "slug",
            "subcategories"
        ]


class ProductVariantSerializer(serializers.ModelSerializer):

    final_price = serializers.SerializerMethodField()

    def get_final_price(self, obj):
        return obj.final_price

    class Meta:
        model = ProductVariant
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):

    main_image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    product_variant = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )
    average_rating =serializers.SerializerMethodField()

    def get_main_image(self, obj):

        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            return ProductImageSerializer(
                main_image,
                context=self.context
            ).data

        return None

    def get_images(self, obj):

        images = obj.images.filter(is_main=False)
        if images:
            return ProductImageSerializer(
                images,
                many=True,
                context=self.context
            ).data

    def get_product_variant(self, obj):

        return ProductVariantSerializer(
            obj.variants.all(),
            many=True,
            context=self.context
        ).data
    
    def get_average_rating(self, obj):

        average = obj.review.aggregate(
            Avg("rating")
        )["rating__avg"]
        return round(average, 1) if average else 0

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = [
            "product_id",
            "slug",
            "created_at",
            "updated_at"
        ]

class MiniProductSerializer(serializers.ModelSerializer):

    main_image = serializers.SerializerMethodField()

    def get_main_image(self, obj):

        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            return ProductImageSerializer(
                main_image,
                context=self.context
            ).data

        return None

    class Meta:
        model = Product
        fields = [
            "product_id",
            "product_name",
            "main_image"
        ]


class CartItemSerializer(serializers.ModelSerializer):

    product_variant = ProductVariantSerializer(read_only=True)
    product_variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        source="product_variant",
        write_only=True
    )
    item = MiniProductSerializer(
        source="product_variant.product",
        read_only=True
    )
    unit_price = serializers.SerializerMethodField()
    line_price = serializers.SerializerMethodField()

    def update(self, instance, validated_data):

        # ensure that the variant has enough stock to update
        quantity = validated_data.get("quantity")

        if quantity > instance.product_variant.stock:
            raise serializers.ValidationError(
                "Not enough stock."
            )
        
        instance.quantity = quantity
        instance.save()

        return instance
    

    def get_unit_price(self, obj):
        return obj.product_variant.final_price
    

    def get_line_price(self, obj):
        final_price = obj.product_variant.final_price
        quantity = obj.quantity
        return final_price * quantity
    

    class Meta:
        model = CartItem
        fields = "__all__"
        read_only_fields = ["cart"]


class CartSerializer(serializers.ModelSerializer):

    subtotal = serializers.SerializerMethodField()
    total_products = serializers.SerializerMethodField()
    cartitem_set = CartItemSerializer(many=True)

    def get_subtotal(self, obj):
        return sum(
            item.product_variant.final_price * item.quantity
            for item in obj.cartitem_set.all()
        )
    
    def get_total_products(self, obj):
        return sum(
            item.quantity
            for item in obj.cartitem_set.all()
        )

    class Meta:
        model = Cart
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):


    def create(self, validated_data):

        request = self.context["request"]
        product = validated_data.get("product")

        # check if the user already has a review on this product
        if Review.objects.filter(
            user=request.user,
            product=product
        ).exists():
            raise serializers.ValidationError(
                "You cannot have more than one review on the same product"
            )
        
        # check if the user purchased this item
        is_verified = OrderItem.objects.filter(
            order__user=request.user,
            product_variant__product=product
        ).exists()
        
        # create the review
        review = Review.objects.create(
            user = request.user,
            is_verified=is_verified,
            **validated_data
        )

        return review
    

    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["user", "is_verified", "date_created_at"]



class OrderItemSerializer(serializers.ModelSerializer):

    product_info = serializers.SerializerMethodField()
    product_variant = ProductVariantSerializer(
        read_only=True
    )


    def get_product_info(self, obj):
        return MiniProductSerializer(
            obj.product_variant.product,
            context=self.context
        ).data

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):

    order_items = OrderItemSerializer(
        read_only=True,
        many=True
    )


    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["user", "total_price"]


class ResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetToken
        fields = ["id", "user", "token", "expiry_date", "used"]
        read_only_fields = ["token"]
