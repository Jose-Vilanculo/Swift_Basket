import { CategoriesHero } from "../components/Categories/CategoriesHero"
import { Navbar } from "../components/Navbar"
import { useParams } from "react-router-dom";


export const CategoriesPage = () => {

    const { category } = useParams();
    console.log("category:" + category);

    return (
        <>
        <Navbar />

        <main>
            <CategoriesHero />
        </main>
        </>
    )
}