from django import template

register = template.Library()


@register.filter(name='add_class')
def add_class(field, css_class):
    """
    Django template filter to add a CSS class to a form field widget.

    Args:
        field: The form field to which the class should be added.
        css_class: The CSS class to add to the field's widget.

    Returns:
        The form field rendered as a widget with the given CSS class.
    """
    return field.as_widget(attrs={"class": css_class})
