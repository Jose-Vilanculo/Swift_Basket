import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductDetails } from "../components/Product/ProductDetails";
import { ProductReviews } from "../components/Product/ProductReviews";
import API_URL from "../services/api";

export const ProductPage = (props) => {

    const { productSlug } = useParams();
    const [reviewsCount, setReviews] = useState([]);
    const openCart = props.openCart;
    const fetchCartItems = props.fetchCartItems;
    const authenticated = props.authenticated;

    useEffect(() => {
        const getReviews = async() => {

            try {
                const response = await axios.get(
                    `${API_URL}/reviews/?slug=${productSlug}`
                );

                setReviews(response.data.review_count);
            } catch(error) {
                console.log(error);
            };
        };

        getReviews();
    }, [productSlug])
    
    
    return (
        <>
        <main>
            <ProductDetails
                productSlug={productSlug}
                reviewsCount={reviewsCount}
                openCart={openCart}
                fetchCartItems={fetchCartItems}
                authenticated={authenticated}
                />
                
            <ProductReviews
                authenticated={authenticated}
                productSlug={productSlug}
                authenitcated={authenticated}
            />
        </main>
        </>
    )
}