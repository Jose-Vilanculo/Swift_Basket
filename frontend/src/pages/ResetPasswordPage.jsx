import { useParams } from "react-router-dom";
import { ResetPasswordForm } from "../components/Auth/ResetPassword";

export const ResetPassword = () => {
    const { token } = useParams();
    console.log(token);

    return (
        <>
            <ResetPasswordForm token={token}/>
        </>
    );
}