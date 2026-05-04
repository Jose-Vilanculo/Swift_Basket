from django.contrib.auth.models import Group, Permission
from online_store.forms import RegisterUserForm
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse


def register_buyer(request):
    """Verifies username and password then creates a new buyer user.

    Args:
        request

    Returns:
        Home page if the user is successfully created.
        Register page and error message if an error occurs.
    """
    if request.method == "POST":
        form = RegisterUserForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.email = form.cleaned_data["email"]
            user.save()
            account_type = "Buyers"

            # get or create the Buyers group and assign the group to the user
            user_group, created = Group.objects.get_or_create(
                name=account_type
            )
            user.groups.add(user_group)

            login(request, user)
            return redirect("buyer_home")

        else:
            return render(request,
                          "online_store/register_buyer_form.html",
                          {"form": form,
                           "error": "Invalid username or password"},
                          )
    else:
        form = RegisterUserForm()
    return render(request, "online_store/register_buyer_form.html",
                  {"form": form})


def register_vendor(request):
    """Verifies username and password then creates a new vendor user.

    Args:
        request

    Returns:
        Home page if the user is successfully created.
        Register page and error message if an error occurs.
    """
    if request.method == "POST":
        form = RegisterUserForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.email = form.cleaned_data["email"]
            user.save()
            account_type = "Vendors"

            user_group, created = Group.objects.get_or_create(
                name=account_type
            )
            user.groups.add(user_group)
            # if the group didn't exist already, assign permissions
            if created:
                perm_strings = [
                    "online_store.view_product",
                    "online_store.add_product",
                    "online_store.change_product",
                    "online_store.delete_product",
                    "online_store.view_store",
                    "online_store.add_store",
                    "online_store.change_store",
                    "online_store.delete_store"
                ]

                permission = []
                for perm_str in perm_strings:
                    app_label, codename = perm_str.split(".")
                    print(app_label)
                    print(codename)
                    perm = Permission.objects.get(
                        content_type__app_label=app_label,
                        codename=codename
                    )
                    permission.append(perm)
                    print(permission)
                user_group.permissions.set(permission)

            login(request, user)
            return redirect("seller_home")

        else:
            return render(request,
                          "online_store/register_vendor_form.html",
                          {"form": form,
                           "error": "Invalid username or password",
                           })
    else:
        form = RegisterUserForm()
    return render(request, "online_store/register_vendor_form.html",
                  {"form": form})


def login_vendor(request):
    """
    Handles vendor login. Authenticates user and checks if they
    belong to the 'Vendors' group.

    Returns:
        Redirects to seller_home if successful.
        Renders vendor login template with error message if
        authentication fails.
    """
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.groups.filter(name="Vendors").exists():
                login(request, user)
                return redirect("seller_home")
            else:
                return render(request, "online_store/vendor_login.html",
                              {"error": "You do not have a Vendors account."}
                              )
        else:
            return render(request,
                          "online_store/vendor_login.html",
                          {"error": "Invalid username or password."}
                          )
    else:
        return render(request, "online_store/vendor_login.html")


def login_buyer(request):
    """
    Handles buyer login. Authenticates user and checks if they
    belong to the 'Buyers' group.

    Returns:
        Redirects to buyer_home if successful.
        Renders buyer login template with error message if
        authentication fails.
    """
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.groups.filter(name="Buyers").exists():
                login(request, user)
                return redirect("buyer_home")
            else:
                return render(request, "online_store/buyer_login.html",
                              {"error": "You do not have a Shopper account."}
                              )
        else:
            return render(request,
                          "online_store/buyer_login.html",
                          {"error": "Invalid username or password"}
                          )
    else:
        return render(request, "online_store/buyer_login.html")


def register_login(request):
    """
    Displays the register or login choice page for users.

    Returns:
        Renders register_or_login.html template.
    """
    return render(request, "online_store/register_or_login.html")


def logout_user(request):
    """
    Logs out the currently authenticated user and redirects to the homepage.
    """
    if request.user is not None:
        logout(request)
        return HttpResponseRedirect(reverse("home"))


def welcome(request):
    """
    Displays a welcome page for authenticated users.

    Returns:
        welcome.html if user is authenticated.
        Redirects to alternate login if not authenticated.
    """
    if request.user.is_authenticated:
        return render(request, "welcome.html")
    else:
        return HttpResponseRedirect(reverse("e-commerce:alter-login"))
