import classes from './Auth.module.css'
import { useState } from 'react';
import axios from 'axios';
import API_URL from "../../services/api"


export const ForgotPasswordForm = () => {

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            await axios.post(
                `${API_URL}/api/password-reset/request/`,
                {
                    email,
                }
            );

            setSuccessMessage(
                "If an account exists with that email, a reset link has been sent."
            )

            setEmail("");
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
    };

    return (
        <div className={classes.authContainer}>
            <div className={classes.authCard}>

                <form
                    className={classes.authForm}
                    onSubmit={handleSubmit}
                >

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

                    <h1>Reset Password</h1>

                    <p className={classes.authSubtitle}>
                        Enter your email address and we'll send you a password reset link.
                    </p>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <p className={classes.authFooter}>
                        Remember your password?
                        <a href="/login">
                            {" "}Login
                        </a>
                    </p>

                </form>

            </div>
        </div>
    );
};