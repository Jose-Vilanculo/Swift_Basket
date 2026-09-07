import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import classes from "./Contact.module.css";
import { useState } from "react";
import axios from "axios";
import API_URL from "../../services/api";

export const Contact = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        comment: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Please enter your name.");
            return;
        }

        if (!formData.email.trim()) {
            alert("Please enter your email.");
            return;
        }

        if (!formData.comment.trim()) {
            alert("Please enter a message.");
            return;
        }

        try {
            await axios.post(`${API_URL}/api/contact/`, formData);

            alert("Message sent successfully!");

            setFormData({
                name: "",
                email: "",
                phone: "",
                comment: "",
            });
        } catch (error) {
            alert("Failed to send message.");
            console.error(error);
        }
    };


    return (
        <section className={classes.contactContainer} id="contact">
            <div className={classes.contactLeft}>
                <div className={classes.contactTag}>
                    Contact Us
                </div>

                <h1>We Are Here to Help!</h1>

                <p>
                    Let us know how we can best serve you.
                    Use the contact form to email us about
                    your needs. It's an honor to support
                    you through your shopping experience.
                </p>

                <div className={classes.contactInfo}>
                    <div className={classes.contactPill}>
                        <MdEmail size={20}/>
                        <span>swiftbasket@gmail.com</span>
                    </div>

                    <div className={classes.contactPill}>
                        <FaPhoneAlt size={20}/>
                        <span>+27 67 771 2850</span>
                    </div>

                    <div className={classes.contactPill}>
                        <FaXTwitter size={20}/>
                        <span>swiftbasket_ecom</span>
                    </div>
                </div>
            </div>

            <form className={classes.contactForm} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="comment"
                    placeholder="Comment"
                    rows={8}
                    value={formData.comment}
                    onChange={handleChange}
                />

                <button type="submit">
                    SEND MESSAGE
                </button>
            </form>
        </section>
    );
}
