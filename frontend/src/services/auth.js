import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const isAuthenticated = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        return false;
    }

    try {
        const decoded = jwtDecode(accessToken);

        // Token is still valid
        if (decoded.exp * 1000 > Date.now()) {
            return true;
        }

        // Token expired, try to refresh
        return await refreshAccessToken();

    } catch {
        return false;
    }
};

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
        return false;
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
                refresh: refreshToken,
            }
        );

        localStorage.setItem("access_token", response.data.access);

        if (response.data.refresh) {
            localStorage.setItem("refresh_token", response.data.refresh);
        }

        return true;

    } catch (error) {
        console.error(error)
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return false;
    }
};


export const getAccessToken = () => {
    return localStorage.getItem("access_token");
}

export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
}

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}