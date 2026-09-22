import classes from "./ProductDetailsSkeleton.module.css";

export const ProductDetailsSkeleton = () => {
    return (
        <section className={classes["product-section"]}>

            {/* Product Images */}
            <div className={classes["image-section"]}>
                <div className={classes.gallery}>

                    <div className={classes.mainImage}>

                        {/* Previous arrow */}
                        <div className={`${classes.arrow} ${classes.leftArrow}`} />

                        {/* Main image */}
                        <div className={classes.imagePlaceholder} />

                        {/* Next arrow */}
                        <div className={`${classes.arrow} ${classes.rightArrow}`} />

                    </div>

                    {/* Thumbnails */}
                    <div className={classes.thumbnails}>
                        <div className={classes.thumbnail} />
                        <div className={classes.thumbnail} />
                        <div className={classes.thumbnail} />
                        <div className={classes.thumbnail} />
                    </div>

                </div>
            </div>


            {/* Product Information */}
            <div className={classes["product-infomation"]}>
                <div className={classes.info}>

                    {/* Category links */}
                    <div className={classes.links}>
                        <div className={classes.link} />
                        <div className={classes.link} />
                    </div>


                    {/* Product name */}
                    <div className={classes.title} />


                    {/* Price + reviews */}
                    <div className={classes["price-review"]}>

                        <div className={classes.price} />

                        <div className={classes.review}>
                            <div className={classes.stars} />
                            <div className={classes.reviewText} />
                        </div>

                    </div>


                    {/* Description */}
                    <div className={classes["description-box"]}>

                        <div className={classes.heading} />

                        <div className={classes.description}>
                            <div />
                            <div />
                            <div />
                        </div>

                    </div>


                    {/* Variant */}
                    <div className={classes.variant}>

                        <div className={classes.label} />

                        <div className={classes.select} />

                    </div>


                    {/* Quantity + Add to cart */}
                    <div className={classes["quantity-cart"]}>

                        <div className={classes.container}>

                            <div className={classes.quantityLabel} />

                            <div className={classes.quantity}>
                                <div />
                                <div />
                                <div />
                            </div>

                        </div>

                        <div className={classes["add-to-cart"]} />

                    </div>

                </div>
            </div>

        </section>
    );
};