from django import template


register = template.Library()


@register.filter(name='has_group')
def has_group(user, group_name):
    """
    Django template filter to check if a user belongs to a specific group.

    Args:
        user: The user instance to check group membership for.
        group_name: The name of the group to check.

    Returns:
        True if the user is in the specified group, False otherwise.
    """
    return user.groups.filter(name=group_name).exists()
