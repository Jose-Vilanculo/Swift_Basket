import { useEffect, useState } from 'react';
import classes from './Auth.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../services/api';


export const ResetPasswordForm = (props) => {

    const token = props.token;
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [valid, setValid] = useState(false);

    // Verify the token
    useEffect(() => {
        const verify = async () => {
            try {
                await axios.post(
                    `${API_URL}/api/password-reset/verify/`,
                    {
                        token,
                    }
                );

                setValid(true);
            } catch {
                setValid(false);
            }
        };

        verify();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        if (!valid) return;

        setLoading(true);

        try {
            await axios.post(
                `${API_URL}/api/password-reset/confirm/`,
                {
                    token,
                    password,
                    password_conf: passwordConf,
                }
            );

            setSuccessMessage(
                "Your password has been successfully updated, Redirecting you to Login page..."
            );

            setPassword("");
            setPasswordConf("");
            navigate("/login", {
                state: location.state,
            });
        }
        catch (error) {
            console.error(error.response?.data || error);


            // Catch and set DRF error message
            const errors = error.response?.data;

            if (errors) {
                const firstError = Object.values(errors)[0];

                setSuccessMessage("") // Clear any previous success message

                setErrorMessage(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : firstError
                );
            } else {
                setErrorMessage(
                    "Something went wrong."
                );
            };
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className={classes.authContainer}>
            <div className={classes.authCard}>

                <form
                    className={classes.authForm}
                    onSubmit={handleSubmit}
                >

                    <h1>Reset Password</h1>
                    
                    {
                        !valid
                        ? (
                            <>
                            <div className={classes.invalid}>
                                <p> Invalid or expired reset token</p>
                            </div>
                            </>
                        ): (
                            <>
                                {successMessage && (
                                    <div className={classes.successMessage}>
                                        {successMessage}
                                    </div>
                                    )}

                                    {errorMessage && (
                                        <div className={classes.errorMessage}>
                                            {errorMessage}
                                        </div>
                                    )}

                                    

                                    <p className={classes.authSubtitle}>
                                        Enter your new password and confirm the password.
                                    </p>

                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <input
                                        type="password"
                                        name="passwordConf"
                                        placeholder="Confirm Password"
                                        value={passwordConf}
                                        onChange={(e) => setPasswordConf(e.target.value)}
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Reset Password"}
                                    </button>
                            </>
                        )
                    }

                    


                </form>

            </div>
        </div>
    )
}