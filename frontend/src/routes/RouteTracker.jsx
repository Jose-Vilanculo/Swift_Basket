import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const RouteTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/login") {
            sessionStorage.setItem(
                "previousPage",
                location.pathname
            );
        }
    }, [location]);

    return null;
};