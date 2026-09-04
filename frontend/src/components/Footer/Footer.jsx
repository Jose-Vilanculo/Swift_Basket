import classes from './Footer.module.css'
import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { Copyright } from 'lucide-react';
import { logout } from '../../services/auth';
import { useLocation, useNavigate } from 'react-router-dom';



const navItems = [
    {name: "Home", href: "#hero", path: "hero"},
    {name: "Contact Us", href: "#contact", path: "contact"},
]



export const Footer = (props) => {

    const navigate = useNavigate();
    const location = useLocation();
    const authenticated = props.authenticated;
    const initialize = props.initialize;
    

    const handleLogout = () => {
        logout();
        // force page to reload and update state if already on home page
        if (location.pathname === "/") {
            window.location.reload();
        } else {
            navigate("/");
            initialize();
        }
    }


    const goToSection = (id) => {
        if (location.pathname === "/") {
            document.getElementById(id)?.scrollIntoView({
                behavior: "smooth",
            });
        } else {
            navigate("/", {
                state: { scrollTo: id },
            });
        }
    };

    return (

        <footer>
            <div className={classes["upper-footer"]}>

                <div className={classes["left-section"]}>
                    {/* Nav Logo */}
                    <a href="#hero" className={classes["logo-link"]}>
                        <div className={classes.logo}>
                            <h1 className={classes["logo-text"]}>Swift Basket</h1>
                        </div>
                    </a>
                    <p>
                        23 Townsend str, Kuilsriver<br />
                        Cape Town,
                        8530
                    </p>
                    <p>
                        <span className={classes.bold}>Phone</span>: (+27) 67 771 2850<br />
                        <span className={classes.bold}>Email</span>: jozivilanculo@gmail.com
                    </p>
                </div>

               

                <div className={classes["right-section"]}>

                     <div className={classes["middle-section"]}>
                        <h4 className={classes.heading4}>Quick Links</h4>
                        {navItems.map((e, key) => (
                            <a
                                onClick={() => goToSection(e.path)}
                                key={key}
                                className={classes.links}
                            >
                                {e.name}
                            </a>
                        ))}
                        {
                            authenticated
                                ? (
                                    <>
                                        <a
                                            href={"/orders"}
                                            className={classes.links}
                                        >
                                            Orders
                                        </a>
                                        <a
                                            onClick={handleLogout}
                                            className={classes.links}
                                        >
                                            Logout
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <a
                                            href={"/register"}
                                            className={classes.links}
                                        >
                                            Sign Up
                                        </a>
                                        <a
                                            href={"/login"}
                                            className={classes.links}
                                        >
                                            Login
                                        </a>
                                    </>
                                )
                        }
                        
                    </div>

                    <div className={classes.sm}>
                        <h4 className={classes.heading4}>Social Media</h4>

                        <a href="https://www.instagram.com/" target='_blank' className={classes.card}>
                            <FaInstagram size={18} className={classes.icon} />
                            <p>Instagram</p>
                        </a>
                        <a href="https://www.facebook.com/" target='_blank' className={classes.card}>
                            <FaFacebookF size={18} className={classes.icon} />
                            <p>Facebook</p>
                        </a>
                        <a href="https://x.com/" target='_blank' className={classes.card}>
                            <FaXTwitter size={18} className={classes.icon} />
                            <p>X/Twitter</p>
                    </a>
                    </div>

                </div>
            </div>
            <div className={classes["lower-footer"]}>
                
                <div className={classes.dash}></div>

                <div className={classes.copy}>
                    <p>
                        <Copyright size={13}/> Copy Right SwiftBasket (Pty) Ltd.
                        @2026 All Rights Reserved
                    </p>
                    <p>
                        Designed by <span className={classes.name}>Jose Vilanculo</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}