import { Navbar } from "../components/Navbar"
import { RegisterForm } from "../components/Auth/Register"


export const Register = () => {

    return (
        <>
            <Navbar />
            <main>
                <RegisterForm />
            </main>
            
        </>
    )
}