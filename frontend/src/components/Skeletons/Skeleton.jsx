import classes from "./Skeleton.module.css";


export const Skeleton = ({ className = "" }) => {
    return (
        <div className={` ${classes.skeleton} ${className}`}></div>
    );
}