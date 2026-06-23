import shopperImage from "../../assets/shopper.png";
import classes from "./Hero.module.css";

export const Hero = () => {
    return (
        <section className={classes.hero} id="hero">
            <div className={classes.content}>
                <h2>Explore Your</h2>

                <h1>
                    One Stop Shop
                </h1>

                <p>
                    Swift Basket is your One-Stop-Shop, offering you a variety
                    of Shops and Categories to choose from all from just One
                    App. Find great deals now and start shopping today.
                </p>

                <a href="#categories">Shop Now</a>

            </div>

            <div className={classes.imageSection}>
                <div className={classes.circle}></div>

                <img
                    src={shopperImage}
                    alt="Shopping customer"
                    className={classes.shopper}
                />
            </div>

            <div className={classes.cornerShape}></div>
        </section>
    );
};