import { useEffect, useState } from "react";
import classes from './PopularProducts.module.css'
import { HiMiniStar, HiOutlineStar } from "react-icons/hi2";
import { formatPrice } from "../../services/formatPrice";
import { LiaCartPlusSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../services/auth";
import axios from "axios";
import { addGuestCartItem } from "../../services/guest_cart";
import useEmblaCarousel from "embla-carousel-react";

export const PopularProducts = (props) => {

    const openCart = props.openCart;
    const fetchCartItems = props.fetchCartItems;
    const [products, setProducts] = useState([]);
    const authenticated = props.authenticated;
    const navigate = useNavigate();


    // Use effect to get popular products
    useEffect(() => {
        const fetchProducts = async () => {

            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/popular-products/`
                );

                setProducts(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);


    // console.log(products)

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
            console.log("select variant");
            window.location.href = `/product/${product.slug}`;
        } else {
            try {

                console.log(product.product_variant[0].id);

                const accessToken = getAccessToken();
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
                fetchCartItems(authenticated);
                openCart();
                
                
                } catch (error) {
                console.error(error.response.data);
            }
        }

    }

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
    });

    return (
        <>
            <div className={classes.embla}>
                <div className={classes.emblaViewport} ref={emblaRef}>
                    <div className={classes.emblaContainer}>
                        {products.map(product => (
                            <div
                                key={product.product_id}
                                className={classes.emblaSlide}
                            >
                                <div className={classes["product-cards"]}>
                                    {/* Your existing product card */}
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
                                                href={`http://localhost:5173/product/${product.slug}`}
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
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className={classes.prev}
                    onClick={() => emblaApi?.scrollPrev()}
                >
                    ←
                </button>

                <button
                    className={classes.next}
                    onClick={() => emblaApi?.scrollNext()}
                >
                    →
                </button>
            </div>
            
        </>
    )
}