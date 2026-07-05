import { Contact } from "../components/Home/Contact"
import { Hero } from "../components/Home/Hero"
import { HomeCategories } from "../components/Home/HomeCategories"

export const Home = () => {

    return (
        <>

            <main>
                <Hero />
                <HomeCategories />
                <Contact />
            </main>
        </>
    )
}