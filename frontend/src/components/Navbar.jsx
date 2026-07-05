import { Menu, Search, Trash2, X } from 'lucide-react';
import classes from './Navbar.module.css'
import { useEffect, useState, useRef } from 'react';
import { CiShoppingBasket} from 'react-icons/ci';
import { PiUserLight } from 'react-icons/pi';
import axios from 'axios';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { getAccessToken, logout } from '../services/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteGuestCartItem, updateGuestQuantity } from '../services/guest_cart';


const navItems = [
    {name: "Home", href: "/"},
    {name: "Contact Us", href: "#contact"},
    {name: "Categories", href: "#categories"}
]


export const Navbar = (props) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [openCategory, setOpenCategory] = useState(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const isCartOpen = props.isCartOpen;
    const setIsCartOpen = props.setIsCartOpen;
    const fetchCartItems = props.fetchCartItems;
    const cartItems = props.cartItems;
    const authenicated = props.authenicated
    const initialize = props.initialize

    

    // Use effect to get categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/categories/"
                );

                setCategories(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
        // console.log(getAccessToken())
    }, []);


    // console.log(cartItems);
    // console.log(cartItems.cartitem_set)


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
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogIn = async() => {
        if (authenicated) {
            await initialize();
        }
        navigate("/login");
        }

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
        if (!authenicated) {
            updateGuestQuantity(GuestItemId, quantity);
            fetchCartItems(authenicated);
            return;
        }

    try {
        const accessToken = getAccessToken()

        await axios.patch(
            `http://127.0.0.1:8000/api/cart-items/${cartItemId}/`,
            { "quantity": quantity },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        fetchCartItems(authenicated);
    } catch (error) {
        console.error(error);
    }
};

    const deleteButton = async (cartItemId, variantId) => {

        if (!authenicated) {
            deleteGuestCartItem(variantId);
            fetchCartItems(authenicated)
            return;
        }

        try {
            const accessToken = getAccessToken()

            await axios.delete(
                `http://127.0.0.1:8000/api/cart-items/${cartItemId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            fetchCartItems(authenicated);
        } catch (error) {
            console.error(error);
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
            <a href="#hero" className={classes["logo-link"]}>
                <div className={classes.logo}>
                    <h1 className={classes["logo-text"]}>Swift Basket</h1>
                </div>
            </a>

            {/* Desktop Nav */}
            <div className={classes["nav-items"]}>
                <a href="/" className={classes["nav-text"]}>
                    Home
                </a>

                <a href="#contact" className={classes["nav-text"]}>
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
                <div className={classes["search-bar"]}>
                    <form action="/search" method="GET">
                        <div className={classes["input-wrapper"]}>
                            <input
                                type="text"
                                name="q"
                                placeholder="Search products..."
                            />

                            <button type="submit">
                                <Search size={15}/>
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* Right-side Nav */}
            <div
                className={
                    authenicated
                    ? classes["user-cart"]
                    : classes["no-user-cart"]
                }

            >

                {/* User */}
                <div ref={menuRef} className={classes["menu-ref"]}>
                    <div
                        className={
                            authenicated
                            ? classes["user-wrapper"]
                            : classes["no-user-wrapper"]
                        }
                        // only allow if user is logged in
                        onClick={() => {
                            if (authenicated) {
                                setIsUserMenuOpen((prev) => !prev);
                            } else {
                                handleLogIn()
                            }
                        }}
                    >
                        {isUserMenuOpen && (
                            <div className={classes["user-menu"]}>
                                <a
                                    href="/profile"
                                    className={classes["user-menu-item"]}
                                >
                                    Manage Profile
                                </a>

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
                                authenicated
                                ? classes.user
                                : classes["no-user"]
                            }
                        >
                            <a onClick={handleLogIn}>Login</a>
                        </div>
                        <div className={classes["user-image"]}>
                            <div className={classes.image}>
                                <PiUserLight size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            
                
                { /* Cart */}
                <div
                    className={classes.cart}
                    onClick={() => setIsCartOpen((prev) => !prev)}
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

            {isMenuOpen && (
                <div className={classes["menu-overlay"]}>

                    <div className={classes["mobile-nav-items"]}>

                        {/* Search Bar */}
                        <div className={classes["search-bar"]}>
                            <form action="/search" method="GET">
                                <div className={classes["input-wrapper"]}>
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="Search products..."
                                    />

                                    <button type="submit">
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
                </div>)
            }

            {/* Cart Overlay*/}
            {isCartOpen && (
                <>
                <div
                    className={classes["cart-overlay"] }
                    onClick={() => setIsCartOpen((prev) => !prev)}
                >
                </div>
                {/* Sliding Cart */}
                <div className={classes["cart-slider"]}>
                    {/* Top Heading and Button */}
                    <div className={classes["cart-header"]}>
                        <h2>Your Shopping <span className={classes.bag}>Bag</span></h2>
                        <X
                            onClick={() => setIsCartOpen((prev) => !prev)}
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
                                            <h5>{item.item.product_name}</h5>
                                            {Object.entries(item.product_variant.attributes).map(([key, value]) => (
                                                <p key={key}>
                                                    {key}: {value}
                                                </p>
                                            ))}
                                            <h4>R {item.line_price}</h4>
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
                                <h4>R {cartItems.subtotal}</h4>
                            </div>
                            <a>
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