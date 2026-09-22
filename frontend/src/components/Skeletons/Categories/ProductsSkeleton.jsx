import { HiOutlineStar } from "react-icons/hi2";
import { Skeleton } from "../Skeleton";
import classes from "./ProductsSkeleton.module.css";


export const ProductsSkeleton = () => {
    return (
        <>
            {[1, 2, 3, 4].map((item) => (
                <div className={classes.productCards} key={item}>
                <Skeleton className={classes.imageContainer} />
                <Skeleton className={classes.name} />
                <Skeleton className={classes.nameSecond} />
                
                <div className={classes.rating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <HiOutlineStar key={star} color={"gray"} />
                    ))}
                </div>

                <div className={classes.bottom}>
                    <Skeleton className={classes.price}/>
                    <div className={classes.buttons}>
                        <Skeleton className={classes.viewItem} />
                        <Skeleton className={classes.addItem} />
                    </div>
                </div>
            </div>
            ))}
        </>
    )
}