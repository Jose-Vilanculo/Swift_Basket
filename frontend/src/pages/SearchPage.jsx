import { useParams } from "react-router-dom"
import { SearchSection } from "../components/Search/SearchSection"

export const SearchPage = (props) => {

    const { lookup } = useParams();
    const setIsCartOpen = props.setIsCartOpen;
    const fetchCartItems = props.fetchCartItems;
    const authenticated = props.authenticated;


    return (
        <>
            <main>
                <SearchSection
                    lookUp={lookup}
                    setIsCartOpen={setIsCartOpen}
                    fetchCartItems={fetchCartItems}
                    authenticated={authenticated}
                />
            </main>
        </>
    )
}