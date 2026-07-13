import { useEffect, useState, useRef } from 'react';
import classes from './ProductDetails.module.css'
import axios from 'axios';
import { HiMiniStar, HiOutlineStar } from 'react-icons/hi2';
import { formatPrice } from '../../services/formatPrice';
import { ShoppingCart } from 'lucide-react';
import { getAccessToken } from '../../services/auth';
import { addToCart } from '../../services/guest_cart';


export const ProductDetails = (props) => {

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState("");

    const [expanded, setExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);

    const [quantity, setQuantity] = useState(1);

    const descriptionRef = useRef(null);
    const productSlug = props.productSlug;
    const reviewsCount = props.reviewsCount;
    const setIsCartOpen = props.setIsCartOpen;
    const fetchCartItems = props.fetchCartItems;
    const authenicated = props.authenicated;


    useEffect(() => {
        const fetchProduct = async() => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/products/?product=${productSlug}`
                );


                setProduct(response.data.results[0]);
                console.log(response.data.results);
            } catch(error) {
                console.log(error);
            };
        };

        fetchProduct();
        console.log(reviewsCount)
    }, [productSlug, reviewsCount]);


    useEffect(() => {
        const element = descriptionRef.current;

        if (!element) return;

        setShowReadMore(
            element.scrollHeight > element.clientHeight
        );
    }, [product]);


    if (!product) {
        return <div>Loading...</div>;
    };


    // Logic for adding an item to users cart
    const maxStock = 99;

    const decrease = () => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const increase = () => {
        setQuantity(prev => Math.min(maxStock, prev + 1));
    };


    const addItem = async() => {

        console.log(variant)

        if (!authenicated) {
            addToCart(variant.id, quantity);
            fetchCartItems(authenicated);
            setIsCartOpen(true);
            return;
        }

        const accessToken = getAccessToken();
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/cart-items/",
                {
                    product_variant_id: variant.id,
                    quantity: quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            fetchCartItems(authenicated);
            setIsCartOpen(true);
        } catch(error) {
            console.error(error.response.data);
        }
    };

    const galleryImages = [
        product.main_image,
        ...product.images,
    ];

    const attributeName = Object.keys(product.product_variant[0].attributes)[0];
    const variant =
        selectedVariant === ""
            ? null
            : product.product_variant[selectedVariant];



    return (
        <section className={classes["product-section"]}>
            <div className={classes["image-section"]}>
                <div className={classes.gallery}>

                    <div className={classes.mainImage}>

                        <button
                            className={classes.arrow}
                            onClick={() =>
                                setSelectedImage(prev =>
                                    prev === 0
                                        ? galleryImages.length - 1
                                        : prev - 1
                                )
                            }
                        >
                            ←
                        </button>

                        <img
                            src={galleryImages[selectedImage].image}
                            alt={product.product_name}
                        />

                        <button
                            className={classes.arrow}
                            onClick={() =>
                                setSelectedImage(prev =>
                                    prev === galleryImages.length - 1
                                        ? 0
                                        : prev + 1
                                )
                            }
                        >
                            →
                        </button>

                    </div>

                    <div className={classes.thumbnails}>

                        {galleryImages.map((image, index) => (
                            <img
                                key={image.id}
                                src={image.image}
                                alt=""
                                onClick={() => setSelectedImage(index)}
                                className={
                                    selectedImage === index
                                        ? classes.active
                                        : ""
                                }
                            />
                        ))}

                    </div>

                </div>
            </div>

            {/* Product Infomation */}
            <div className={classes["product-infomation"]}>
                <div className={classes.info}>
                    <div className={classes.links}>
                        {product.category.parent_name && (
                            <a href={`/products/${product.category.parent_slug}`}>
                                {product.category.parent_name} /
                            </a>
                            
                        )}
                        <a href={`/products/${product.category.slug}`}>
                            {product.category.name}
                        </a>
                    </div>
                    <h2>{product.product_name}</h2>
                    <div className={classes["price-review"]}>
                        <h3>
                            {variant
                                ? `R ${formatPrice(Number(variant.final_price).toFixed(2))}`
                                : `R ${formatPrice(product.price)}`}
                        </h3>
                        <div className={classes.review}>
                            {product.average_rating > 0 && (
                                <div className={classes.rating}>
                                    <div>
                                    {[1, 2, 3, 4, 5].map((star) =>
                                        star <= product.average_rating ? (
                                            <HiMiniStar key={star} />
                                        ) : (
                                            <HiOutlineStar key={star} />
                                        )
                                    )}
                                    </div>
                                    <a>{reviewsCount} reviews</a>
                                </div>
                            )}

                            {product.average_rating == 0 && (
                                <div className={classes["no-rating"]}>
                                    <div>
                                    {[1, 2, 3, 4, 5].map((star) => (                                      
                                            <HiOutlineStar key={star} />
                                        )
                                    )}
                                    </div>
                                    <p>no reviews</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={classes["description-box"]}>
                        <h4>Description:</h4>
                        <div className={classes.description}>
                            <p
                                ref={descriptionRef}
                                className={expanded ? classes.expanded : ""}
                            >
                                {product.description}
                            </p>

                            {showReadMore && (
                                <button
                                    type="button"
                                    className={classes.readMore}
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    {expanded ? "Read less" : "Read more"}
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Variant selection dropdown */}
                    <div className={classes.variant}>
                        <label>{attributeName}</label>

                        <select
                            value={selectedVariant}
                            onChange={(e) => setSelectedVariant(Number(e.target.value))}
                        >
                            <option value="" disabled>
                                Select {attributeName}
                            </option>

                            {product.product_variant.map((variant, index) => (
                                <option
                                    key={variant.id}
                                    value={index}
                                >
                                    {variant.attributes[attributeName]}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className={classes["quantity-cart"]}>
                        <div className={classes.container}>
                            <label>quantity</label>

                            <div className={classes.selector}>
                                <button onClick={decrease}>−</button>

                                <span>{String(quantity).padStart(2, "0")}</span>

                                <button onClick={increase}>+</button>
                            </div>
                        </div>
                        <button
                            className={classes["add-to-cart"]}
                            onClick={() => addItem()}
                            disabled={!variant}
                        >
                            {variant ? "Add to Cart" : `Select ${attributeName}`}
                            <ShoppingCart size={22}/>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Setup and add the reviews count from your App.jsx
// Add a quantity selector and a add to cart button
// Make everything responsive