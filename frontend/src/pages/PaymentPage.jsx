import { PaymentSection } from "../components/Payment/Payment"

export const PaymentPage = (props) => {

    const cartItems = props.cartItems;
    const fetchCartItems = props.fetchCartItems;

    return (
        <>
            <main>
                <PaymentSection cartItems={cartItems} fetchCartItems={fetchCartItems}/>
            </main>
        </>
    )
}