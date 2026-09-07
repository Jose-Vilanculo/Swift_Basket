import { useState, useEffect } from 'react';
import classes from './CategoriesHero.module.css';
import axios from 'axios';
import API_URL from '../../services/api';
// import electronicsHome from '../../assets/heroCategory.jpg'

export const CategoriesHero = (props) => {

    const category = props.category

    const [categoryDetails, setCategoryDetails] = useState([]);

     // Use effect to get products by their categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/categories/?category=${category}`
                );

                setCategoryDetails(response.data.results[0]);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, [category]);

    // console.log(categoryDetails)


    return (
        // <section className={classes.hero}>
        // <div className={classes.img}>
        //     <div className={classes["img-overlay"]}>
        //         <div className={classes.content}>
        //             <h1>Gym & Fitness</h1>
        //             <p>
        //                 Discover quality skincare designed to cleanse, hydrate, and care for your skin. Build a routine that leaves your skin looking its best.
        //             </p>
        //             <a href="#categories">Shop Now</a>
        //         </div>
        //     </div>
        // </div>
        
        // </section>

        <section id='category-hero'
            className={classes.hero}
            style={{ "--bg": `url(${categoryDetails.background_image})` }}
        >
        <div className={classes.img}>
            <div className={classes["img-overlay"]}>
                <div className={classes.content}>
                    <h1>{categoryDetails.name}</h1>
                    <p>{categoryDetails.description}</p>
                    <a href="#products">Shop Now</a>
                </div>
            </div>
        </div>
        
        </section>
    )
}