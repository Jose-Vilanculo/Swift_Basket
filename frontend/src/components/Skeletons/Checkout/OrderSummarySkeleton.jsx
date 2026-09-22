import classes from "./OrderSummarySkeleton.module.css";

export const OrderSummarySkeleton = () => {
    return (
        <div className={classes.cart}>

            {/* Header */}
            <h2 className={classes.header}>Order Summary</h2>
            <div className={classes.total} />
            <div className={classes.deliveryDate} />

            {/* Cart Items */}
            <div className={classes.items}>

                {[1, 2].map((item) => (
                    <div className={classes["cart-item"]} key={item}>

                        <div className={classes["product-img"]} />

                        <div className={classes["product-details"]}>

                            <div className={classes.details}>
                                <div className={classes.productName} />
                                <div className={classes.variant} />
                                <div className={classes.variant} />
                                <div className={classes.quantity} />
                            </div>

                            <div className={classes.price}>
                                <div className={classes.priceText} />
                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* Line */}
            <div className={classes.line} />

            {/* Summary */}
            <div className={classes.summary}>

                <div className={classes.subtotal}>
                    <div className={classes.summaryText} />
                    <div className={classes.summaryPrice} />
                </div>

                <div className={classes.delivery}>
                    <div className={classes.summaryText} />
                    <div className={classes.summaryPrice} />
                </div>

            </div>

            {/* Payment button */}
            <div className={classes.payment}>
                <div className={classes.paymentText} />
                <div className={classes.paymentPrice} />
            </div>

        </div>
    );
};