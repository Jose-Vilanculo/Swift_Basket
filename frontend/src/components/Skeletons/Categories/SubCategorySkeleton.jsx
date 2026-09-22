import { Skeleton } from "../Skeleton";
import classes from "./SubCategorySkeleton.module.css"


export const SubCategorySkeleton = () => {
    return (
        <>
            {[1, 2, 3, 4].map((item) => (
                <div className={classes.cards} key={item}>
                <Skeleton className={classes.img} />
                <div className={classes.text}>
                    <Skeleton className={classes.name} />
                    <div className={classes.discover}>
                        <Skeleton className={classes.discover}/>
                    </div>
                </div>
            </div>
            ))}
        </>
    );
}