import classes from './Auth.module.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
    const navigate = useNavigate()
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

            setErrorMessage("") // Clear any previous error message

            console.log(response.data);

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
            navigate("/")
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
            }

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
                            <a href="/register"> Register</a>
                        </p>
                    </div>

                </form>

            </div>
        </div>
    );
};