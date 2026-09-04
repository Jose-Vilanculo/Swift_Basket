import { useState, useEffect } from 'react'
import classes from './Subcategory.module.css'
import axios from 'axios'
import { IoIosArrowForward } from 'react-icons/io'


export const Subcategory = (props) => {

    const category = props.category

    const [subcategory, setSubcategory] = useState([]);

     // Use effect to get subcategories
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/categories/?category=${category}`
                );

                setSubcategory(response.data.results[0].subcategories);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSubCategories();
    }, [category]);

    return (
        <>
        
            {/* target for my scroll to reach this page whether the sub-category is rendered or not */}
            <div id="sub-category-anchor" className={classes.anchor} />

            <section id='sub-category'
                // Only show this section on parent categories
                className={
                    subcategory.length > 0
                    ?classes["sub-category-section"]
                    :classes.hidden
                }
            >
                <div className={classes.container}>
                    {subcategory.map((category, key) => (
                        <a
                            className={classes.cards}
                            href={`/products/${category.slug}`}
                            key={key}
                        >
                            <img src={category.icon} alt="category icons" />
                            <div className={classes.text}>
                                <h4>{category.name}</h4>
                                <div className={classes.discover}>
                                <p>Discover</p>
                                <IoIosArrowForward size={15} className={classes.arrow}/>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

            </section>
        </>
    )
}