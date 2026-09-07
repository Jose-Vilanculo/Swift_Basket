import axios from 'axios';
import API_URL from "../services/api"
import { Menu, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CiShoppingBasket } from 'react-icons/ci';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { PiUserLight } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAccessToken, logout } from '../services/auth';
import { formatPrice } from '../services/formatPrice';
import { deleteGuestCartItem, updateGuestQuantity } from '../services/guest_cart';
import classes from './Navbar.module.css';


const navItems = [
    {name: "Home", href: "/"},
    {name: "Contact Us", href: "#contact"},
    {name: "Categories", href: "#categories"}
]


export const Navbar = (props) => {

    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [openCategory, setOpenCategory] = useState(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const userProfile = props.userProfile;
    const isCartOpen = props.isCartOpen;
    const setIsCartOpen = props.setIsCartOpen;
    const isCartVisible = props.isCartVisible
    const setIsCartVisible = props.setIsCartVisible
    const openCart = props.openCart;
    const closeCart = props.closeCart;
    const fetchCartItems = props.fetchCartItems;
    const cartItems = props.cartItems;
    const authenticated = props.authenticated;
    const initialize = props.initialize;

    
    // Use effect to get categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/categories/`
                );

                setCategories(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
        // console.log(getAccessToken())
    }, []);


    /* useEffect to lock scrolling while menu is open */
    useEffect(() => {
    const html = document.documentElement;

        if (isMenuOpen) {
            html.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        } else {
            html.style.overflow = "";
            document.body.style.overflow = "";
        }

        return () => {
            html.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);


    /* useEffect to lock scrolling while cart is open */
    useEffect(() => {
    const html = document.documentElement;

        if (isCartOpen) {
            html.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        } else {
            html.style.overflow = "";
            document.body.style.overflow = "";
        }

        return () => {
            html.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [isCartOpen]);


    // Handling logging out

    const handleLogIn = async() => {
        if (authenticated) {
            await initialize();
        };
        navigate("/login");
        };

    const handleLogout = () => {
        logout();
        // force page to reload and update state if already on home page
        if (location.pathname === "/") {
            window.location.reload();
        } else {
            navigate("/");
            initialize();
        }
    }


    const menuRef = useRef(null);
    // Use Effect to close the user menu when you click on the page
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);


    const updateQuantity = async (cartItemId, quantity, GuestItemId) => {

        console.log(GuestItemId + quantity);
        if (!authenticated) {
            updateGuestQuantity(GuestItemId, quantity);
            fetchCartItems(authenticated);
            return;
        }

        try {
            const accessToken = getAccessToken();

            await axios.patch(
                `${API_URL}/api/cart-items/${cartItemId}/`,
                { "quantity": quantity },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            fetchCartItems(authenticated);
        } catch (error) {
            console.error(error);
        }
    };


    const deleteButton = async (cartItemId, variantId) => {

        if (!authenticated) {
            deleteGuestCartItem(variantId);
            fetchCartItems(authenticated)
            return;
        }

        try {
            const accessToken = getAccessToken()

            await axios.delete(
                `${API_URL}/api/cart-items/${cartItemId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            fetchCartItems(authenticated);
        } catch (error) {
            console.error(error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsMenuOpen();

        if (!searchValue.trim()) return;

        navigate(`/search-products/${searchValue}`);
    };


    const goToSection = (id) => {
        if (location.pathname === "/") {
            document.getElementById(id)?.scrollIntoView({
                behavior: "smooth",
            });
        } else {
            navigate("/", {
                state: { scrollTo: id },
            });
        }
    };


    return (
        <nav className={classes.navbar}>

            {/* Menu button */}
            <button
                className={classes["menu-button"]}
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                {!isMenuOpen ? <Menu size={25} /> : <X size={25} />}
            </button>
            
            {/* Nav Logo */}
            <a onClick={() => goToSection("hero")} className={classes["logo-link"]}>
                <div className={classes.logo}>
                    <h1 className={classes["logo-text"]}>Swift Basket</h1>
                </div>
            </a>

            {/* Desktop Nav */}
            <div className={classes["nav-items"]}>
                <a onClick={() => goToSection("hero")} className={classes["nav-text"]}>
                    Home
                </a>

                <a onClick={() => goToSection("contact")} className={classes["nav-text"]}>
                    Contact Us
                </a>

                <div className={classes.categoryMenu}>
                    <span className={classes["nav-text"]}>
                        Categories <IoIosArrowDown size={15} className={classes["arrow-down"]}/>
                    </span>

                    <div className={classes.mainDropdown}>
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={classes.mainCategory}
                            >
                                {category.subcategories?.length > 0 && (
                                    <a
                                        href={`/products/${category.slug}`}
                                        className={classes["main-link"]}
                                    >
                                    <img 
                                        src={category.icon}
                                        alt='categories background image'
                                        className={classes["img-icon"]}
                                    />
                                    <span>{category.name}</span>
                                    </a>
                                )}
                                

                                {/* Only put arrow if category has a subcategory */}
                                {category.subcategories?.length > 0 && <IoIosArrowForward size={15} className={classes.arrow}/>}
                                

                                {category.subcategories?.length > 0 && (
                                    <div className={classes.subDropdown}>
                                        {category.subcategories.map((subcategory) => (
                                            <a
                                                key={subcategory.id}
                                                href={`/products/${subcategory.slug}`}
                                                className={classes.subCategory}
                                            >
                                                <img 
                                                    src={subcategory.icon}
                                                    alt='categories background image'
                                                    className={classes["img-icon"]}
                                                />
                                                {subcategory.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className={classes["search-bar-desktop"]}>
                    <form onSubmit={handleSubmit}>
                        <div className={classes["input-wrapper"]}>
                            <input
                                type="text"
                                name="search"
                                required
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search products..."
                            />

                            <button>
                                <Search size={15}/>
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* Right-side Nav */}
            <div
                className={
                    authenticated
                    ? classes["user-cart"]
                    : classes["no-user-cart"]
                }

            >

                {/* User */}
                <div ref={menuRef} className={classes["menu-ref"]}>
                    <div
                        className={
                            authenticated
                            ? classes["user-wrapper"]
                            : classes["no-user-wrapper"]
                        }
                        // only allow if user is logged in
                        onClick={() => {
                            if (authenticated) {
                                setIsUserMenuOpen((prev) => !prev);
                            } else {
                                handleLogIn()
                            }
                        }}
                    >
                        {isUserMenuOpen && (
                            <div className={classes["user-menu"]}>

                                <a
                                    href="/orders"
                                    className={classes["user-menu-item"]}
                                >
                                    My Orders
                                </a>

                                <button
                                    className={classes["user-menu-item"]}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                                            <div 
                            className={
                                authenticated
                                ? classes.user
                                : classes["no-user"]
                            }
                        >
                            <a onClick={handleLogIn}>Login</a>
                        </div>
                        <div className={classes["user-image"]}>
                            <div className={classes.image}>
                                {
                                    userProfile
                                        ? ( 
                                            <div className={classes.letter}>
                                                <h3>{userProfile.username[0]}</h3>
                                            </div>
                                        ):(
                                            <PiUserLight size={20} />
                                        )
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            
                
                { /* Cart */}
                <div
                    className={classes.cart}
                    onClick={openCart}
                >
                    <div className={classes.basket}>
                        <CiShoppingBasket size={25}/>
                    </div>
                    {cartItems.total_products > 0 && (
                        <div className={classes.counter}>
                            <div className={classes.number}>{cartItems.total_products}</div>
                        </div>
                    )}
                    
                </div>
            </div>

            {/* Mobile Nav */}

                <div
                    className={`${classes["menu-overlay"]} ${
                        isMenuOpen ? classes.open : ""
                    }`}
                >
                    {/* Search Bar */}
                    <div className={classes["search-bar"]}>
                        <form onSubmit={handleSubmit}>
                            <div className={classes["input-wrapper"]}>
                                <input
                                    type="text"
                                    name="search"
                                    required
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search products..."
                                />

                                <button>
                                    <Search size={15}/>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Mobile Categories */}
                    {navItems.map((item, key) => {
                        if (item.name === "Categories") {
                            return (
                                <div key={key} className={classes["mobile-category-container"]}>
                                    <div
                                        className={classes["mobile-nav-text"]}
                                        onClick={() => setIsCategoriesOpen((prev) => !prev)}
                                    >
                                        Categories
                                    </div>

                                    {isCategoriesOpen && (
                                        <div className={classes["mobile-categories"]}>
                                            {categories.map((category) => {
                                                // console.log(
                                                //     category.name,
                                                //     category.subcategories
                                                // );
                                                return (
                                                    <div
                                                        key={category.id}
                                                        className={classes["mobile-category"]}
                                                    >
                                                        <div
                                                            className={classes["mobile-category-header"]}
                                                        >
                                                            <a
                                                                href={`/products/${category.slug}`}
                                                                className={classes["mobile-category-link"]}
                                                            >
                                                                {category.name}
                                                            </a>

                                                            {category.subcategories?.length > 0 && (
                                                                <button
                                                                    className={classes["expand-button"]}
                                                                    onClick={(e) => {

                                                                        e.preventDefault();
                                                                        e.stopPropagation();

                                                                        setOpenCategory(
                                                                            openCategory === category.id
                                                                                ? null
                                                                                : category.id
                                                                        )
                                                                    }}
                                                                >
                                                                    {openCategory === category.id ? "−" : "+"}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {openCategory === category.id &&
                                                            category.subcategories?.length > 0 && (
                                                                <div
                                                                    className={
                                                                        classes["mobile-subcategories"]
                                                                    }
                                                                >
                                                                    {category.subcategories.map(
                                                                        (subcategory) => (
                                                                            <a
                                                                                key={subcategory.id}
                                                                                href={`/products/${subcategory.slug}`}
                                                                                className={
                                                                                    classes["mobile-subcategory"]
                                                                                }
                                                                            >
                                                                                {subcategory.name}
                                                                            </a>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                );
                                            })}
                                            </div>
                                    )}
                                </div>
                            );
                        }

                        // Home and Contact Us
                        return (
                            <a
                                key={key}
                                href={item.href}
                                className={classes['mobile-nav-text']}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        );
                    })}

                    </div>

            {/* Cart Overlay*/}
            {isCartVisible && (
                <>
                <div
                    className={`${classes["cart-overlay"]} ${
                        isCartOpen ? classes.open : ""
                    }`}
                    onClick={closeCart}
                />

                {/* Cart Slider */}
                <div
                    className={`${classes["cart-slider"]} ${
                        isCartOpen ? classes.open : ""
                    }`}
                    onTransitionEnd={() => {
                        if (!isCartOpen) {
                            setIsCartVisible(false);
                        }
                    }}
                >
                    {/* Top Heading and Button */}
                    <div className={classes["cart-header"]}>
                        <h2>Your Shopping <span className={classes.bag}>Bag</span></h2>
                        <X
                            onClick={closeCart}
                            size={30}
                            className={classes["cart-x-button"]}
                        />
                    </div>
                    {/* Cart body */}
                    <div className={classes["cart-body"]}>

                        {/* Empty Carts */}
                        {cartItems.total_products == 0 && (
                            <div className={classes["empty-cart"]}>
                                <h3>Your bag is empty.</h3>
                                <a onClick={() => setIsCartOpen((prev) => !prev)}>
                                    START SHOPPING NOW
                                </a>
                            </div>
                        )}
                        {/* Cart Items */}
                        {cartItems?.total_products > 0 && 
                            
                                cartItems.cartitem_set.map((item) => (
                                    <div className={classes["cart-item"]} key={item.id}>

                                        <div className={classes["product-img"]}>
                                            <img src={item.item.main_image.image}/>
                                        </div>

                                        <div className={classes["product-details"]}>
                                            <h5 onClick={() => {
                                                navigate(`/product/${item.item.slug}`);
                                                setIsCartOpen(false);
                                                }
                                            }>
                                                {item.item.product_name}
                                            </h5>
                                            {Object.entries(item.product_variant.attributes).map(([key, value]) => (
                                                <p key={key}>
                                                    {key}: {value}
                                                </p>
                                            ))}
                                            <h4>R {formatPrice(item.line_price)}</h4>
                                        </div>

                                        <div className={classes["product-form"]}>
                                            <div
                                                className={classes.delete}
                                                onClick={() => deleteButton(item.id, item.product_variant.id)}
                                            >
                                                <Trash2 size={17}/>
                                            </div>
                                            <div className={classes["form"]}>

                                                <div className={classes["quantity-form"]}>
                                                    <button
                                                        type="button"
                                                        className={classes["quantity-button"]}
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity - 1,
                                                                item.product_variant.id,
                                                            )
                                                        }
                                                        // disable the minus once on 1
                                                        disabled={item.quantity <= 1} 
                                                    >
                                                        -
                                                    </button>

                                                    <span className={classes["quantity-value"]}>
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className={classes["quantity-button"]}
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity + 1,
                                                                item.product_variant.id,
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    
                                ))
                        }

                    </div>

                    {/* Checkout Cart */}
                    <div className={classes["cart-checkout"]}>
                        {cartItems.total_products > 0 && (
                            <>
                            <div className={classes["total-price"]}>
                                <h4>Subtotal ({cartItems.total_products} Items)</h4>
                                <h4>R {formatPrice(cartItems.subtotal)}</h4>
                            </div>
                            <a href="/checkout">
                                Continue to Checkout
                            </a>
                            </>
                        )}
                    </div>
                </div>
                </>
            )}
            
        </nav>
    )
}