import classes from "./HomeCategories.module.css"

import sportsGearImage from "../../assets/Home/sportsgear.jpeg"
import gymEquipment from "../../assets/Home/gymequipment.jpg"
import tech from "../../assets/Home/tech.jpg"
import homeLiving from "../../assets/Home/homeliving.jpg"
import fashionHim from "../../assets/Home/fashionhim.jpg"
import fashionHer from "../../assets/Home/fashionher.png"
import { PopularProducts } from "./PopularProducts"
import { useNavigate } from "react-router-dom"

export const HomeCategories = (props) => {

    const fetchCartItems = props.fetchCartItems;
    const authenticated = props.authenticated;
    const openCart = props.openCart;
    const navigate = useNavigate();


    return (
        <section className={classes["category-section"]} id="categories">
            <h2 className={classes.heading}>Shop by Categories</h2>
    
            {/* First category Blocks */}
            <div className={classes.container}>
    
                <div className={classes["sports-deals"]} onClick={() => navigate("/products/sportswear")}>
                    <img
                        src={sportsGearImage}
                        alt="A woman running"
                        className={classes.image}
                    >
                    </img>
                    <div className={classes["img-overlay"]}>
                        <div className={classes["text"]}>
                            <h2>
                                Dont miss out on<br />
                                Our latest
                            </h2>
                            <h1>
                                Sport Deals.
                            </h1>
                        </div>
                        <a href="http://localhost:5173/products/sportswear">
                            View Items {" >> "}
                        </a>
                    </div>
                </div>

                <div className={classes["right-container"]}>

                    <div className={classes["gym-equipment"]} onClick={() => navigate("/products/gym-fitness")}>
                        <img
                            src={gymEquipment}
                            alt="Dumbells"
                            className={classes.image}
                        >
                        </img>
                        <div className={classes["img-overlay"]}>
                            <div className={classes["text-2"]}>
                                <h2>
                                    Keep Fit with our<br />
                                </h2>
                                <h1>
                                    Gym Equipment
                                </h1>
                                <a href="http://localhost:5173/products/gym-fitness">
                                    View Items {" >> "}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={classes["tech-deals"]} onClick={() => navigate("/products/electronics")}>
                        <img
                            src={tech}
                            alt="Tech gadgets"
                            className={classes.image}
                        >
                        </img>
                        <div className={classes["img-overlay"]}>
                            <div className={classes["text-3"]}>
                                <h2>
                                    Latest<br />
                                </h2>
                                <h1>
                                    Tech Deals
                                </h1>
                                <a href="http://localhost:5173/products/electronics">
                                    View Items {" >> "}
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Popular Products */}
            <h2 className={classes.heading}>Popular Products</h2>
            <PopularProducts
                openCart={openCart}
                fetchCartItems={fetchCartItems}
                authenticated={authenticated}
            />


            {/* Second category Blocks */}
            <div className={classes["second-container"]}>
                <div className={classes["home-living"]} onClick={() => navigate("/products/home-living")}>
                    <img
                        src={homeLiving}
                        alt="Living space furniture"
                        className={classes.image}
                    >
                    </img>
                    <div className={classes["img-overlay"]}>
                        <div className={classes["text"]}>
                            <h2>
                                Elevate your Home with<br />
                            </h2>
                            <h3>
                                Timeless Furniture
                            </h3>
                            <h4>
                                Explore furniture designed to transform your living space.
                            </h4>
                        </div>
                        <a href="http://localhost:5173/products/home-living">
                            View Items {" >> "}
                        </a>
                    </div>
                </div>

                <div className={classes["bottom-container"]}>
                    <div className={classes["mens-fashion"]} onClick={() => navigate("/products/mens-fashion")}>
                        <img
                            src={fashionHim}
                            alt="A man"
                            className={classes.image}
                        >
                        </img>
                        <div className={classes["img-overlay"]}>
                            <div className={classes["text"]}>
                                <h2>
                                    Fashion<br />
                                    For
                                </h2>
                                <h1>
                                    HIM
                                </h1>
                                <a href="http://localhost:5173/products/mens-fashion">
                                    View Items {" >> "}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={classes["womens-fashion"]} onClick={() => navigate("/products/womens-fashion")}>
                        <img
                            src={fashionHer}
                            alt="Two woman"
                            className={classes.image}
                        >
                        </img>
                        <div className={classes["img-overlay"]}>
                            <div className={classes["text"]}>
                                <h2>
                                    Fashion<br />
                                    For
                                </h2>
                                <h1>
                                    HER
                                </h1>
                                <a href="http://localhost:5173/products/womens-fashion">
                                    View Items {" >> "}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>            
        </section>
    )
}