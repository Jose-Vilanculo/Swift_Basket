import { useParams } from "react-router-dom";
import { CategoriesHero } from "../components/Categories/CategoriesHero";
import { Products } from "../components/Categories/Products";
import { Subcategory } from "../components/Categories/Subcategory";


export const CategoriesPage = (props) => {

    const { category } = useParams();
    // console.log("category:" + category);

    const setIsCartOpen = props.setIsCartOpen;
    const fetchCartItems = props.fetchCartItems;
    const authenticated = props.authenticated
    return (
        <>

        <main>
            <CategoriesHero category={category} />
            <Subcategory category={category} />
            <Products
                category={category}
                setIsCartOpen={setIsCartOpen}
                fetchCartItems={fetchCartItems}
                authenticated={authenticated}
            />
        </main>
        </>
    )
}