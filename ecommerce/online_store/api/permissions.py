from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsVendor(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_vendor


class IsBuyer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_buyer
    

class IsAdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):

        if request.method in SAFE_METHODS:
            return True

        # Allow authenticated admin write permissions
        return request.user.is_authenticated and request.user.is_staff

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        # Allow only admin to make changes to categories
        return request.user.is_staff


class IsOwnerVendorOrReadOnly(BasePermission):
    """
        - Anyone can read (GET)
        - Only vendor owners can edit/delete their own products
    """
    def has_permission(self, request, view):

        if request.method in SAFE_METHODS:
            return True

        # Allow authenticated vendors write permissions
        return request.user.is_authenticated and request.user.is_vendor

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        # Allow only store owners to edit or delete products
        return request.user == obj.store.owner
    
    
class IsProductVariantOwnerVendorOrReadOnly(BasePermission):
    """
        - Anyone can read (GET)
        - Only vendor owners can edit/delete their own products
    """
    def has_permission(self, request, view):

        if request.method in SAFE_METHODS:
            return True

        # Allow authenticated vendors write permissions
        return request.user.is_authenticated and request.user.is_vendor

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        # Allow only store owners to edit or delete products
        return request.user == obj.product.store.owner


class IsOwnerBuyerOrReadOnly(BasePermission):
    """
        - Anyone can read (GET)
        - Only buyers can create, edit/delete their own reviews
    """
    def has_permission(self, request, view):

        if request.method in SAFE_METHODS:
            return True

        # Allow authenticated buyers write permissions
        return request.user.is_authenticated and request.user.is_buyer

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        # Allow only store owners to edit or delete reviews
        return request.user == obj.user


class IsStoreOwnerOrReadOnly(BasePermission):

    def has_permission(self, request, view):

        if request.method in SAFE_METHODS:
            return True

        # Allow authenticated vendors write permissions
        return request.user.is_authenticated and request.user.is_vendor

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        # Allow only store owners to edit their store
        return request.user == obj.owner


class IsOwnerOrReadOnly(BasePermission):
    """
        - Anyone can read (GET)
        - Only vendor owners can edit/delete their own products
    """
    def has_permission(self, request, view):

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):

        return request.user == obj.user