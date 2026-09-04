import { useLocation } from "react-router-dom";
import { Contact } from "../components/Home/Contact"
import { Hero } from "../components/Home/Hero"
import { HomeCategories } from "../components/Home/HomeCategories"
import { useEffect } from "react";

export const Home = (props) => {

    const fetchCartItems = props.fetchCartItems;
    const authenticated = props.authenticated;
    const openCart = props.openCart;

    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            document
                .getElementById(location.state.scrollTo)
                ?.scrollIntoView({
                    behavior: "smooth",
                });
        }
    }, [location]);

    return (
        <>

            <main>
                <Hero />
                <HomeCategories
                    openCart={openCart}
                    fetchCartItems={fetchCartItems}
                    authenticated={authenticated}
                />
                <Contact />
            </main>
        </>
    )
}