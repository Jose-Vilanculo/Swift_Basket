import { Navbar } from "../components/Navbar"
import { LoginForm } from "../components/Auth/Login"


export const Login = () => {

    return (
        <>
            <Navbar />
            <main>
                <LoginForm />
            </main>
            
        </>
    )
}