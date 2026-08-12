import { CheckoutSection } from "../components/Checkout/Checkout"

export const CheckoutPage = (props) => {

    const cartItems = props.cartItems
    const loading = props.loading;
    
    return (
        <>
        <main>
            <CheckoutSection cartItems={cartItems} loading={loading} />
        </main>
        
        </>
    )
}