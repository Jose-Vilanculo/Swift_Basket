import classes from "./OrdersSectionSkeleton.module.css";

export const OrdersSectionSkeleton = () => {
    return (
        <section className={classes.orderSection}>
            <div className={classes.container}>

                {/* Heading */}
                <h2 className={classes.header}>My Orders</h2>
                <div className={classes.line} />

                {/* Orders */}
                <div className={classes.orders}>

                    {[1, 2, 3].map((order) => (
                        <div className={classes.card} key={order}>

                            {/* Upper Card */}
                            <div className={classes.upperCard}>

                                <div className={classes.cardLeft}>

                                    <div className={classes.orderId} />

                                    <div className={classes.orderDelivery}>

                                        <div className={classes.orderDate} />

                                        <div className={classes.verticalDash} />

                                        <div className={classes.delivery}>
                                            <div className={classes.plane} />
                                            <div className={classes.deliveryText} />
                                            <div className={classes.deliveryDate} />
                                        </div>

                                    </div>

                                </div>

                                {/* Invoice */}
                                <div className={classes.cardRight}>
                                    <div className={classes.invoiceButton}>
                                        <div className={classes.invoiceIcon} />
                                        <div className={classes.invoiceText} />
                                    </div>
                                </div>

                            </div>

                            {/* Divider */}
                            <div className={classes.dividerLine} />

                            {/* Lower Card */}
                            <div className={classes.lowerCard}>

                                <div className={classes.viewDetails} />

                                <div className={classes.summarySide}>
                                    <div className={classes.total}>

                                        <div className={classes.totalLine} />

                                        <div className={classes.numbers}>
                                            <div className={classes.totalLabel} />
                                            <div className={classes.totalPrice} />
                                        </div>

                                        <div className={classes.totalLine} />
                                        <div className={classes.totalLine} />

                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};
