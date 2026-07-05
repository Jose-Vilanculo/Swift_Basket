import { CategoriesHero } from "../components/Categories/CategoriesHero"
import { Products } from "../components/Categories/Products";
import { Subcategory } from "../components/Categories/Subcategory";
import { useParams } from "react-router-dom";


export const CategoriesPage = (props) => {

    const { category } = useParams();
    // console.log("category:" + category);

    const setIsCartOpen = props.setIsCartOpen;
    const fetchCartItems = props.fetchCartItems;
    const authenicated = props.authenicated
    return (
        <>

        <main>
            <CategoriesHero category={category} />
            <Subcategory category={category} />
            <Products
                category={category}
                setIsCartOpen={setIsCartOpen}
                fetchCartItems={fetchCartItems}
                authenicated={authenicated}
            />
        </main>
        </>
    )
}