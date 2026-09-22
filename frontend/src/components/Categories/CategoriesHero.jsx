import { useState, useEffect } from 'react';
import classes from './CategoriesHero.module.css';
import axios from 'axios';
import API_URL from '../../services/api';
import { CategoriesHeroSkeleton } from '../Skeletons/Categories/CategoriesHeroSkeleton';


export const CategoriesHero = (props) => {

    const category = props.category
    const [loading, setLoading] = useState(true)
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);

     // Use effect to get products by their categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {

                setLoading(true);
                setBackgroundLoaded(false);

                const response = await axios.get(
                    `${API_URL}/api/categories/?category=${category}`
                );

                setCategoryDetails(response.data.results[0]);
                setLoading(false);

            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, [category]);


    useEffect(() => {
        if (!categoryDetails?.background_image) return;

        const image = new Image();

        image.src = categoryDetails.background_image;

        image.onload = () => {
            setBackgroundLoaded(true);
        };

        image.onerror = () => {
            setBackgroundLoaded(true);
        };

        return () => {
            image.onload = null;
            image.onerror = null;
        };
    }, [categoryDetails]);


    return (

        <section id='category-hero'
            className={classes.hero}
            style={
                backgroundLoaded
                    ? { "--bg": `url(${categoryDetails.background_image})` }
                    : {}
            }
        >
        <div className={classes.img}>
            <div className={classes["img-overlay"]}>
                <div className={classes.content}>
                    {
                        loading || !backgroundLoaded
                        ? (
                            <CategoriesHeroSkeleton />
                        ) : (
                            <>
                                <h1>{categoryDetails.name}</h1>
                                <p>{categoryDetails.description}</p>
                                <a href="#products">Shop Now</a>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
        
        </section>
    )
}