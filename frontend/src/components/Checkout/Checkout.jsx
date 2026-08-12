import { useEffect, useState } from 'react';
import { formatPrice } from '../../services/formatPrice';
import classes from './Checkout.module.css'
import { AddressForm } from './forms/AddressForm';
import axios from 'axios';
import { getAccessToken } from '../../services/auth';
import { CiEdit } from 'react-icons/ci';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const CheckoutSection = (props) => {
    const navigate = useNavigate();

    const cartItems = props.cartItems;
    const loading = props.loading;

    const [error, setError] = useState("");
    const [dbAddress, setDbAddress] = useState(false);
    const [openForm, setOpenForm] = useState(true);

    // console.log(cartItems)

    const [address, setAddress] = useState({
        full_name: "",
        phone_number: "",
        street: "",
        suburb: "",
        city: "",
        province: "",
        postal_code: "",
        save_address: true,
    });

    const isAddressComplete =
        address.full_name.trim() &&
        address.phone_number.trim() &&
        address.street.trim() &&
        address.suburb.trim() &&
        address.city.trim() &&
        address.province.trim() &&
        address.postal_code.trim();

    
    useEffect(() => {
        if (!loading && cartItems.total_products === 0) {
            console.log(cartItems);
            navigate("/", { replace: true });
        }
    }, [loading, cartItems, navigate]);

    useEffect(() => {

        const token = getAccessToken();

        const getAddress = async() => {
            // Get saved previously address
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/address/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const results = response.data.results[0];
                // console.log(results);

                setAddress({
                    full_name: results.full_name,
                    phone_number: results.phone_number,
                    street: results.street,
                    suburb: results.suburb,
                    city: results.city,
                    province: results.province,
                    postal_code: results.postal_code,
                });
                setDbAddress(true);
                setOpenForm(false);

            } catch(error) {
                console.error(error);
            }
            
        }

        getAddress();
        
    }, []);


    const handlePayNow = async() => {
        if (!isAddressComplete) {
            setError("Complete your address before proceeding.");
        } else {
            
            // overwrite or create new address then redirect to payment page
            if (address.save_address) {
                const token = getAccessToken();
                try {
                    await axios.post(
                        `http://127.0.0.1:8000/api/address/`,
                        address,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                } catch(error) {
                    console.error(error);
                };
            };

            // store address information to use on payment page
            localStorage.setItem(
                "checkout_address",
                JSON.stringify(address)
            );

            // redirecting...
            navigate("/secure-payment");
            
        };
    }


    return (
        <section className={classes.checkoutSection}>

            <div className={classes.container}>

                <div className={classes.address}>
                    <h2>Delivery To</h2>
                    <p>We'll use this address to deliver your order.</p>

                    {
                        !openForm
                            ? (
                                <>
                                    <div className={classes.existingAddress}>
                                        <div className={classes.text}>
                                            <h4>{address.full_name}</h4>
                                            <h4>{address.phone_number}</h4>
                                            <p>{address.street}, {address.suburb}, {address.city}, {address.province}, {address.postal_code}</p>
                                        </div>
                                    </div>
                                    <button className={classes.edit} onClick={() => setOpenForm(true)}>
                                            <h5>Edit Address</h5> <CiEdit size={17}/>
                                    </button>
                                </>
                            )
                            : (
                                <>
                                <AddressForm
                                    address={address}
                                    setAddress={setAddress}
                                />
                                {
                                    dbAddress && (
                                        <button className={classes.edit} onClick={() => setOpenForm(false)}>
                                            <h6>Use This Address</h6> <Check size={20} color='#00ae1c'/>
                                        </button>
                                    )
                                }
                                </>
                            )
                    }
                </div>


                <div className={classes.cart}>
                    
                    <h2>Order Summary</h2>
                    <h4>Total R {formatPrice(cartItems.subtotal)} - {cartItems.total_products}
                        {cartItems.total_products > 1 ? " Items" : " Item"}
                    </h4>
                    <h3>Est Delivery date, {" "}
                        {new Date(cartItems.estimated_delivery).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </h3>
                    
                    {/* Cart Items */}
                    <div className={classes.items}>
                    {cartItems?.total_products > 0 && 
                    
                        cartItems.cartitem_set.map((item) => (
                            <div className={classes["cart-item"]} key={item.id}>

                                <div className={classes["product-img"]}>
                                    <img src={item.item.main_image.image}/>
                                </div>

                                <div className={classes["product-details"]}>

                                    <div className={classes.details}>
                                        <h5>
                                            {item.item.product_name}
                                        </h5>
                                        {Object.entries(item.product_variant.attributes).map(([key, value]) => (
                                            <p key={key}>
                                                {key}: {value}
                                            </p>
                                        ))}
                                        <p>quantity: {item.quantity}</p>
                                    </div>

                                    <div className={classes.price}>
                                        <h4>R {formatPrice(item.line_price)}</h4>
                                    </div>
                                    
                                </div>
                            </div>
                        ))
                    }
                    </div>

                    {/* Line */}
                    <div className={classes.line}></div>

                    {/* summary */}
                    <div className={classes.summary}>
                        <div className={classes.subtotal}>
                            <p>Subtotal ({cartItems.total_products} Items)</p>
                            <p>R {formatPrice(cartItems.subtotal)}</p>
                        </div>
                        <div className={classes.delivery}>
                            <p>Delivery fee</p>
                            <p>R {formatPrice(cartItems.delivery_fee)}</p>
                        </div>
                        
                    </div>

                    {error && (
                        <p className={classes.error}>( {error})</p>
                    )}

                    {/* Payment button */}
                    <button
                        className={classes.payment}
                        onClick={handlePayNow}
                    >
                        <p>Pay Now</p>
                        <p>R {formatPrice(cartItems.subtotal + cartItems.delivery_fee)}</p>
                    </button>

                </div>

                

            </div>
        </section>
    )
}