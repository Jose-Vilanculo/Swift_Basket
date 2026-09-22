import { Skeleton } from "../Skeleton";
import classes from "./CategoriesHeroSkeleton.module.css"


export const CategoriesHeroSkeleton = () => {
    return (
        <>
        <div className={classes.skeleton}>
            <Skeleton className={classes.name} />
            <div className={classes.description}>
                <Skeleton className={classes.line} />
                <Skeleton className={classes.line} />
                <Skeleton className={classes.line} />
            </div>
            
            <Skeleton className={classes.button} />
        </div>
        </>
    );
}
