import { formatPrice } from '../../services/formatPrice';
import classes from './Payment.module.css'
import mastercard from "./../../assets/mastercard-svgrepo-com.svg"
import visa from "./../../assets/visa-svgrepo-com.svg"
import payU from "./../../assets/payu-svgrepo-com.svg"
import successSvg from './../../assets/success-filled-svgrepo-com.svg'
import { IoMdCheckmarkCircle, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { GoDash } from 'react-icons/go';
import { useEffect, useState } from 'react';
import { getAccessToken } from '../../services/auth';
import axios from 'axios';
import { BiPackage } from 'react-icons/bi';
import { FiArrowLeft } from 'react-icons/fi';


export const PaymentSection = (props) => {

    const cartItems = props.cartItems;
    const fetchCartItems = props.fetchCartItems;
    const [order, setOrder] = useState([])

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);

    const address = JSON.parse(
        localStorage.getItem("checkout_address")
    );
    const shippingAddress = Object.fromEntries(
        Object.entries(address).map(([key, value]) => [
            `shipping_${key}`,
            value,
        ])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        console.log(address)

        return () => clearTimeout(timer);
    }, [address])

    /* useEffect to lock scrolling while menu is open */
    useEffect(() => {
        const html = document.documentElement;

            if (loading || success) {
                html.style.overflow = "hidden";
                document.body.style.overflow = "hidden";
            } else {
                html.style.overflow = "";
                document.body.style.overflow = "";
            }

            return () => {
                html.style.overflow = "";
                document.body.style.overflow = "";
            };
    }, [loading, success]);


    const handlePay = async() => {
        setLoading(true);
        
        // Avoid clicking pay now twice
        setProcessing(true);

        const token = getAccessToken();

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/order/`,
                {...shippingAddress},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setOrder(response.data);
            setLoading(false);
        } catch(error) {
            console.error(error);
            setProcessing(false);
        }

        setTimeout(() => {
            fetchCartItems();
            setSuccess(true);
        }, 2000);
    }


    return (
        <>
            <section className={classes.paymentSection}>

                {/* Loading overlay */}
                {loading && (
                    <>
                        <div className={classes.loader}></div>
                        <div className={classes.overlay}></div>
                    </>
                )}

                {/* Success pop-up */}
                {success && (
                    <>
                        <div className={classes.overlay}>
                            <div className={classes.success}>

                                <img
                                    src={successSvg}
                                    alt="Success badge"
                                    className={classes.cardIcon}
                                />

                                <h2>Payment Successful!</h2>

                                <p>
                                    Your payment has been proccessed successfully.
                                    You will receive a confirmation email shortly.
                                </p>

                                <div className={classes.orderSummary}>
                                    <div className={classes.line}>
                                        <p>Amount</p>
                                        <p>R {formatPrice(Number(order.total_price) + Number(order.delivery_fee))}</p>
                                    </div>
                                    <div className={classes.line}>
                                        <p>Payment Method</p>
                                        <p>**** 2525</p>
                                    </div>
                                    <div className={classes.line}>
                                        <p>Date</p>
                                        <p>
                                            {new Date(order.date_created_at).toLocaleString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div className={classes.line}>
                                        <p>Order no.</p>
                                        <p>#{order.id}</p>
                                    </div>
                                </div>

                                {/* Orders button */}
                                <a className={classes.orderLink} href='/orders'>
                                    <BiPackage size={18} />
                                    <p>View Your Orders</p>
                                </a>

                                <a className={classes.storeLink} href='/'>
                                    <FiArrowLeft color='black' />
                                    <p>Return to Store</p>
                                </a>

                                {/* Continue shopping button */}
                            </div>
                        </div>
                    </>
                )}
                
                
                

                <div className={classes.container}>

                    {/* Process Feature */}
                    <div className={classes.process}>

                        <div className={classes.step}>
                            <IoMdCheckmarkCircle color='green'/>
                            <p>Confirm Order</p>
                        </div>

                        <GoDash color='black'/>

                        <div className={classes.step}>
                            <IoMdCheckmarkCircle color='green'/>
                            <p>Confirm Address</p>
                        </div>

                        <GoDash color='black'/>
                        
                        <div className={classes.step}>
                            <IoMdCheckmarkCircleOutline color='black'/>
                            <p>Final Payment</p>
                        </div>

                    </div>


                    <div className={classes.text}>
                        <h2>Payment</h2>
                        <p>To finalize your order, kindly complete your order<br />
                            Disclaimer: This is a demo, Never use your actual credit card details
                        </p>
                    </div>

                    {/* Form */}
                    <form className={classes.addressForm}>
                        <div className={classes.grid}>

                            <div className={`${classes.field} ${classes.full}`}>
                                <label>Card Holder Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    placeholder="John Smith"
                                    value={address.full_name}
                                />
                            </div>

                            <div className={`${classes.field} ${classes.full}`}>
                                <label>Card Number</label>
                                <div className={classes.inputWrapper}>
                                    <div className={classes.cardIcons}>
                                        <img
                                            src={mastercard}
                                            alt="Mastercard"
                                            className={classes.cardIcon}
                                        />
                                        <img
                                            src={visa}
                                            alt="Visa"
                                            className={classes.cardIcon}
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        name="card_number"
                                        placeholder="0000 0000 0000 0000"
                                        value="1234 5678 9101 2525"
                                        readOnly
                                    />
                                </div>
                                
                            </div>
            
                            <div className={classes.field}>
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    name='street'
                                    placeholder="MM/YY"
                                    value="12/26"
                                />
                            </div>

                            <div className={classes.field}>
                                <label>CVV</label>
                                <input
                                    type="text"
                                    name='street'
                                    placeholder="###"
                                    value="109"
                                />
                            </div>
                        </div>

                    </form>

                    {/* Payment button */}
                    <button
                        className={classes.payment}
                        disabled={processing}
                        onClick={handlePay}
                    >
                        <p>Pay Now</p>
                        <p>R {formatPrice(cartItems.subtotal + cartItems.delivery_fee)}</p>
                    </button>
                    
                    {/* Secured Button */}
                    <div className={classes.secured}>
                        <h5>Secured By </h5>
                        <img
                            src={payU}
                            alt="PayU"
                            className={classes.cardIcon}
                        />
                    </div>

                </div>
            </section>
        </>
    )
}