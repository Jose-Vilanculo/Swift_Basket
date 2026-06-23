import { Navbar } from "../components/Navbar"
import { ForgotPasswordForm } from "../components/Auth/ForgotPassword"


export const ForgotPassword = () => {

    return (
        <>
            <Navbar />
            <main>
                <ForgotPasswordForm />
            </main>
            
        </>
    )
}