import { useParams } from "react-router-dom";
import { CategoriesHero } from "../components/Categories/CategoriesHero";
import { Products } from "../components/Categories/Products";
import { Subcategory } from "../components/Categories/Subcategory";


export const CategoriesPage = (props) => {

    const { category } = useParams();

    const fetchCartItems = props.fetchCartItems;
    const authenticated = props.authenticated;
    const openCart = props.openCart;


    return (
        <>

        <main>
            <CategoriesHero category={category} />
            <Subcategory category={category} />
            <Products
                category={category}
                openCart={openCart}
                fetchCartItems={fetchCartItems}
                authenticated={authenticated}
            />
        </main>
        </>
    )
}