import classes from './Auth.module.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export const LoginForm = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialize = props.initialize;
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                formData
            );

            // Merge cart logic
            const guestCart = JSON.parse(
                localStorage.getItem("guest_cart") || "[]"
            );
            console.log(guestCart);

            if (guestCart.length > 0) {
                await axios.post(
                    "http://127.0.0.1:8000/api/cart/merge/",
                    {
                        items: guestCart
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${response.data.access}`
                        }
                    }
                );

                localStorage.removeItem("guest_cart");
            }


            setErrorMessage("") // Clear any previous error message

            // Store access and refresh token for authentication
            localStorage.setItem(
                "access_token",
                response.data.access
            )
            localStorage.setItem(
                "refresh_token",
                response.data.refresh
            )

            setSuccessMessage(
                "Login successful! Redirecting..."
            )
            
            await initialize();

            // Navigate to where the page was before login, or to home
            const previous = location.state?.from?.pathname || "/";
            navigate(previous, { replace: true });
            
        } catch (error) {

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
            }

        } finally {
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

                    <h1>Welcome Back</h1>

                    <p className={classes.authSubtitle}>
                        Login to your Swift Basket account.
                    </p>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                    <div className={classes.authLinks}>
                        <p className={classes.authFooter}>
                            Forgot your password?
                            <a href="/forgot-password"> Reset Password</a>
                        </p>

                        <p className={classes.authFooter}>
                            Don't have an account?
                            <a onClick={() => {
                                navigate("/register", {
                                    state: location.state,
                                });
                            }}>
                                Register
                            </a>
                        </p>
                    </div>

                </form>

            </div>
        </div>
    );
};