import classes from './Products.module.css'
import axios from "axios";
import { useEffect, useState } from "react";
import { HiMiniStar, HiOutlineStar } from 'react-icons/hi2';
import { LiaCartPlusSolid } from 'react-icons/lia';
import { getAccessToken } from '../../services/auth';
import { addGuestCartItem } from '../../services/guest_cart';


export const Products = (props) => {

    const category = props.category
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productCount, setProductCount] = useState(0);
    const setIsCartOpen = props.setIsCartOpen
    const fetchCartItems = props.fetchCartItems;
    const [products, setProducts] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");
    const authenicated = props.authenicated
    
    // Use effect to get products by their categories
    useEffect(() => {
        const fetchProducts = async () => {

            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/products/?category=${category}&page=${page}`
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
                    `http://127.0.0.1:8000/api/categories/?category=${category}`
                );

                setCurrentCategory(response.data.results[0].name)
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategory();
    }, [category]);

    // console.log(products)
    console.log(currentCategory);

    const handleAddItem = async (product) => {

        if (!authenicated) {
            addGuestCartItem(product);
            fetchCartItems(authenicated);
            setIsCartOpen(true);
            return;
        }

        if (product.product_variant.length > 1) {
            console.log("select variant")
        } else {
            try {

                console.log(product.product_variant[0].id);

                const accessToken = getAccessToken()
                await axios.post(
                    "http://127.0.0.1:8000/api/cart-items/",
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
                fetchCartItems(authenicated);
                setIsCartOpen(true);
                
                
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
        setPage(1);
    }, [category]);


    return (
        <section className={classes["products-section"]}>
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
                                />
                            </div>

                            <h4>{product.product_name}</h4>

                            {product.average_rating > 0 && (
                                <div className={classes.rating}>
                                    {[1, 2, 3, 4, 5].map((star) =>
                                        star <= product.average_rating ? (
                                            <HiMiniStar key={star} />
                                        ) : (
                                            <HiOutlineStar key={star} />
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
                                <p>R {product.price}</p>
                                
                                <div className={classes.buttons}>
                                    <a className={classes["view-item"]}>View Product</a>
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
                        onClick={() => setPage(page - 1)}
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
                                onClick={() => setPage(item)}
                            >
                                {item}
                            </button>
                        )
                    )}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>

                </div>
            )}
        </section>
    )
}