import { Contact } from "../components/Home/Contact"
import { Hero } from "../components/Home/Hero"
import { HomeCategories } from "../components/Home/HomeCategories"
import { Navbar } from "../components/Navbar"

export const Home = () => {

    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <HomeCategories />
                <Contact />
            </main>
        </>
    )
}