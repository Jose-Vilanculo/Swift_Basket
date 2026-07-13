import { useParams } from "react-router-dom"
import { ProductDetails } from "../components/Product/ProductDetails";
import { useEffect, useState } from "react";
import axios from "axios";

export const ProductPage = (props) => {

    const { productSlug } = useParams();
    const [reviewsCount, setReviews] = useState([]);
    const setIsCartOpen = props.setIsCartOpen;
    const fetchCartItems = props.fetchCartItems;
    const authenicated = props.authenicated;

    useEffect(() => {
        const getReviews = async() => {

            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/reviews/?slug=${productSlug}`
                );

                setReviews(response.data.count);
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
                authenicated={authenicated}
                />
            
        </main>
        </>
    )
}