import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductDetails } from "../components/Product/ProductDetails";
import { ProductReviews } from "../components/Product/ProductReviews";

export const ProductPage = (props) => {

    const { productSlug } = useParams();
    const [reviewsCount, setReviews] = useState([]);
    const setIsCartOpen = props.setIsCartOpen;
    const fetchCartItems = props.fetchCartItems;
    const authenticated = props.authenticated;

    useEffect(() => {
        const getReviews = async() => {

            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/reviews/?slug=${productSlug}`
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
                setIsCartOpen={setIsCartOpen}
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