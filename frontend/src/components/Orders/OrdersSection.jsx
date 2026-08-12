import { useEffect, useState } from 'react'
import classes from './OrdersSection.module.css'
import axios from 'axios';
import { getAccessToken } from '../../services/auth';
import { FaPlaneDeparture } from 'react-icons/fa';
import { AiFillFilePdf } from 'react-icons/ai';
import { formatPrice } from '../../services/formatPrice';


export const OrdersSection = () => {

    const [orders, setOrders] = useState([]);
    const [showMore, setShowMore] = useState(null);

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                const token = getAccessToken();
                const response = await axios.get(
                    'http://127.0.0.1:8000/api/order/',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setOrders(response.data.results);
                // console.log(response.data.results)
            } catch(error) {
                console.error(error);
            }
        }

        fetchOrders();
    }, [])

    if (!orders) {
        return <div><h2>Loading...</h2></div>;
    };


    const getDeliveryDate = (date) => {
        const deliveryDate = new Date(date);
        deliveryDate.setDate(deliveryDate.getDate() + 5);

        return deliveryDate;
    };

    const formatDeliveryDate = (date) => {
        return getDeliveryDate(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    console.log("orders: ");
    console.log(orders);


    return (
        <>
        <section className={classes.orderSection}>
            <div className={classes.container}>
                <h2>My Orders</h2>
                <div className={classes.line}></div>

                <div className={classes.orders}>
                    {orders.map((order) => (
                        <div className={classes.card}>

                            {/* Upper Card */}
                            <div className={classes.upperCard}>

                                {/* Left Side */}
                                <div className={classes.cardLeft}>
                                    <h5>Order ID: #{order.id}</h5>
                                    <div className={classes.orderDelivery}>
                                        {/* Order date */}
                                        <p>
                                            Order Date:&nbsp;
                                            <span className={classes.date}>
                                                {new Date(order.date_created_at).toLocaleString("en-GB", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                })}
                                            </span>
                                        </p>
                                        {/* Vertical Dash */}
                                        <p className={classes.verticalDash}>|</p>

                                        {/* Estimated Date */}
                                        <div>
                                            {
                                                getDeliveryDate(order.date_created_at) < new Date()
                                                    ? (
                                                        <div className={classes.delivered}>
                                                            <FaPlaneDeparture color='#0066c0' />
                                                            <p>Delivered on,&nbsp;</p>
                                                            <p>
                                                                {formatDeliveryDate(order.date_created_at)}
                                                            </p>
                                                        </div>
                                                    )
                                                    : (
                                                        <div className={classes.estDelivery}>
                                                            <FaPlaneDeparture color='#41ac15' />
                                                            <p>Estimated Delivery,&nbsp;</p>
                                                            <p>
                                                                {formatDeliveryDate(order.date_created_at)}
                                                            </p>
                                                        </div>
                                                    )
                                            }
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className={classes.cardRight}>
                                    <button>
                                        <AiFillFilePdf color='white'/>
                                        <p>Invoice</p>
                                    </button>
                                </div>

                            </div>


                            {/* Divider Line */}
                            <div className={classes.dividerLine} />


                            {/* Middle Card */}
                            {
                                showMore ==order.id && (
                                    <>
                                        <div className={classes.middleCard}>
                                            {order.order_items.map((item) => (
                                                <>
                                                    <div className={classes["cart-item"]} key={item.id}>
                        
                                                        <div className={classes["product-img"]}>
                                                            <img src={item.product_info.main_image.image}/>
                                                        </div>
                        
                                                        <div className={classes["product-details"]}>
                        
                                                            <div className={classes.details}>
                                                                <div className={classes.attrQuantity}>
                                                                    <h5>
                                                                        {item.product_info.product_name}
                                                                    </h5>
                                                                    <div className={classes.price}>
                                                                <h4>R {formatPrice(item.price)}</h4>
                                                            </div>
                                                                </div>
                                                                <div className={classes.attrQuantity}>
                                                                    {Object.entries(item.product_variant.attributes).map(([key, value]) => (
                                                                        <p key={key}>
                                                                            {key}: {value}
                                                                        </p>
                                                                    ))}
                                                                    <p>Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            
                                                        </div>
                                                    </div>
                                                    <div className={classes.dividerLine} />
                                                </>
                                                ))}
                                        </div>
                                        
                                    </>
                                )
                            }


                            {/* Order Summary */}
                            {
                                showMore ===order.id && (
                                    <>
                                    <div className={classes.orderSummary}>
                                        <h5>Order Summary:</h5>
                                        <div className={classes.summary}>
                                            <div className={classes.split}>
                                                <p>Subtotal ({order.total_products})</p>
                                                <p>R {formatPrice(order.total_price)}</p>
                                            </div>
                                            <div className={classes.split}>
                                                <p>Delivery</p>
                                                <p>R {formatPrice(order.delivery_fee)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                )
                            }


                            {/* Lower Card */}
                            <div className={classes.lowerCard}>
                                <div className={classes.linkSide}>
                                    {
                                        showMore === order.id
                                            ? (<button onClick={() => setShowMore(showMore === order.id ? null : order.id)}>
                                                    Hide Details
                                                </button>
                                            ) : (
                                                <button onClick={() => setShowMore(showMore === order.id ? null : order.id)}>
                                                    View Details
                                                </button>
                                            )
                                    }
                                    
                                </div>
                                <div className={classes.summarySide}>
                                    <div className={classes.total}>
                                        <div className={classes.totalLine}></div>
                                        <div className={classes.numbers}>
                                            <h5>Total</h5>
                                            <h5>R {formatPrice(Number(order.total_price) + Number(order.delivery_fee))}</h5>
                                        </div>
                                        <div className={classes.totalLine}></div>
                                        <div className={classes.totalLine}></div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </section>
        </>
    )
}