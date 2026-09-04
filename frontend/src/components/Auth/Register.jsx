import classes from './Auth.module.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const RegisterForm = () => {

    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "",
        password: "",
        gender: "",
        phone_number: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    // Updates form data in real time
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    
    // Handles the sumbit logic
    const handleSubmit = async (e) => {
        // Disable Button by changing loading status
        e.preventDefault();
        if (loading) return;

        // Confirm that the two passwords match
        if (formData.password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);

        const data = new FormData();

        // Gather formData into usable data
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (profileImage) {
            data.append("profile_image", profileImage);
        }

        // Make API call to register User
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/register/",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setErrorMessage("") // Clear any previous error message
            setSuccessMessage(
                "Account created successfully! Redirecting..."
            );
            navigate("/login", {
                state: location.state,
            });

            // Clear form data
            setFormData({
                username: "",
                email: "",
                role: "",
                password: "",
                gender: "",
                phone_number: "",
            });
            setConfirmPassword("");
            setProfileImage(null);
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
                {/* REGISTER FORM */}

                <form className={classes.authForm} onSubmit={handleSubmit}>

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

                    <h1>Create Account</h1>

                    <p className={classes.authSubtitle}>
                        Join Swift Basket and start shopping today.
                    </p>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username *"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div className={classes.formRow}>
                        <select name="role" value={formData.role} onChange={handleChange} required>
                            <option value="">Select Role *</option>
                            <option value="buyer">Buyer</option>
                            {/* <option value="vendor">Vendor</option> */}
                        </select>

                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select Gender *</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className={classes.formRow}>
                        <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} required />
                        <input type="password" name="confirm_password" placeholder="Confirm Password *" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    <input
                        type="tel"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />

                    <label className={classes.fileLabel}>
                        Profile Image
                        <input
                            type="file"
                            name="profile_image"
                            accept="image/*"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className={classes.authFooter}>
                        Already have an account?
                        <a onClick={() => {
                            navigate("/login", {
                                state: location.state,
                            });
                        }}>
                            Login
                        </a>
                    </p>

                </form>

            </div>
        </div>
    )
}