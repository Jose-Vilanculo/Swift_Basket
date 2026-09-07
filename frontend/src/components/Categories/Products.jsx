import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { HiMiniStar, HiOutlineStar } from 'react-icons/hi2';
import { LiaCartPlusSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../services/auth';
import { formatPrice } from '../../services/formatPrice';
import { addGuestCartItem } from '../../services/guest_cart';
import classes from './Products.module.css';
import API_URL from "../../services/api";


export const Products = (props) => {

    const category = props.category
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productCount, setProductCount] = useState(0);
    const openCart = props.openCart;
    const fetchCartItems = props.fetchCartItems;
    const [products, setProducts] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");
    const authenticated = props.authenticated
    const navigate = useNavigate();
    const userChangedPage = useRef(false);


    
    // Use effect to get products by their categories
    useEffect(() => {
        const fetchProducts = async () => {

            try {
                const response = await axios.get(
                    `${API_URL}/api/products/?category=${category}&page=${page}`
                );

                setProducts(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 12));
                setProductCount(response.data.count);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, [category, page]);

    // Use effect to get categories
    useEffect(() => {
        const fetchCategory = async () => {

            try {
                const response = await axios.get(
                    `${API_URL}/api/categories/?category=${category}`
                );

                setCurrentCategory(response.data.results[0].name)
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategory();
    }, [category]);

    // console.log(products)
    // console.log(currentCategory);


    const handleAddItem = async (product) => {

        if (!authenticated) {
            const response = addGuestCartItem(product);
            fetchCartItems(authenticated);
            // only open cart if an item is successfully added
            if (response) {
                openCart();
            }
            return;
        }

        if (product.product_variant.length > 1) {
            console.log("select variant")
            window.location.href = `/product/${product.slug}`;
        } else {
            try {

                console.log(product.product_variant[0].id);

                const accessToken = getAccessToken();
                await axios.post(
                    `${API_URL}/api/cart-items/`,
                    {
                        product_variant_id: product.product_variant[0].id,
                        quantity: 1
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                fetchCartItems(authenticated);
                openCart();
                
                
                } catch (error) {
                console.error(error.response.data);
            }
        }

    }

    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        pages.push(1);

        if (page > 4) {
            pages.push("...");
        }

        const start = Math.max(2, page - 2);
        const end = Math.min(totalPages - 1, page + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 3) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [category]);


    // Only scroll to section if the user changes the page
    const changePage = (newPage) => {
        userChangedPage.current = true;
        setPage(newPage);
    };

    useEffect(() => {
        if (!userChangedPage.current) return;

        document.getElementById("sub-category-anchor")?.scrollIntoView({
            behavior: "smooth",
        });

        userChangedPage.current = false;
    }, [page]);


    return (
        <section className={classes["products-section"]} id="products">
            <div className={classes.title}>
                <h2>All {currentCategory} ({productCount} results)</h2>
            </div>
            <div className={classes.container}>
                    {products.map((product) => (
                        <div
                            key={product.product_id}
                            className={classes["product-cards"]}
                        >
                            <div className={classes["image-container"]}>
                                <img
                                    src={product.main_image.image}
                                    alt={product.product_name}
                                    onClick={() => navigate(`/product/${product.slug}`)}
                                />
                            </div>

                            <h4>{product.product_name}</h4>

                            {product.average_rating > 0 && (
                                <div className={classes.rating}>
                                    {[1, 2, 3, 4, 5].map((star) =>
                                        star <= product.average_rating ? (
                                            <HiMiniStar key={star} />
                                        ) : (
                                            <HiOutlineStar key={star} color={"gray"}/>
                                        )
                                    )}
                                </div>
                            )}

                            {product.average_rating == 0 && (
                                <div className={classes["no-rating"]}>
                                    {[1, 2, 3, 4, 5].map((star) => (                                      
                                            <HiOutlineStar key={star} />
                                        )
                                    )}
                                    <p>no reviews</p>
                                </div>
                            )}

                            <div className={classes.bottom}>
                                <p>R {formatPrice(product.price)}</p>
                                
                                <div className={classes.buttons}>
                                    <a
                                        className={classes["view-item"]}
                                        onClick={() => navigate(`/product/${product.slug}`)}
                                    >
                                        View Product
                                    </a>
                                    <button
                                        className={classes["add-item"]}
                                        onClick={() => handleAddItem(product)}
                                    >
                                        <LiaCartPlusSolid size={25} className={classes["cart-item"]} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* page pagination */}
            {totalPages > 1 && (
                <div className={classes.pagination}>

                    <button
                        disabled={page === 1}
                        onClick={() => {
                            changePage(page - 1);
                        }}
                    >
                        Previous
                    </button>

                    {getPageNumbers().map((item, index) =>

                        item === "..." ? (
                            <span key={index}>...</span>
                        ) : (
                            <button
                                key={item}
                                className={page === item ? classes.active : ""}
                                onClick={() => {
                                    changePage(item);
                                }}
                            >
                                {item}
                            </button>
                        )
                    )}

                    <button
                        disabled={page === totalPages}
                        onClick={() => {
                            changePage(page + 1);
                        }}
                    >
                        Next
                    </button>

                </div>
            )}
        </section>
    )
}