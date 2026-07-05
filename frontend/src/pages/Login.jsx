import { LoginForm } from "../components/Auth/Login"


export const Login = (props) => {

    const initialize = props.initialize
    return (
        <>
            <main>
                <LoginForm initialize={initialize} />
            </main>
            
        </>
    )
}