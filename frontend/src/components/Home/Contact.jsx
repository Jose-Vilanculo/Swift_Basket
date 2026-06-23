import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import classes from "./Contact.module.css";

export const Contact = () => {
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

            <form className={classes.contactForm}>
                <input
                    type="text"
                    placeholder="Name"
                />

                <input
                    type="email"
                    placeholder="Email"
                />

                <input
                    type="tel"
                    placeholder="Phone number"
                />

                <textarea
                    placeholder="Comment"
                    rows={8}
                />

                <button type="submit">
                    SEND MESSAGE
                </button>
            </form>
        </section>
    );
}
