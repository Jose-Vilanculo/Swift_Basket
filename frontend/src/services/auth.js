import axios from "axios";

export const isAuthenticated = async() => {

    async function authenticated() {

        const accessToken = localStorage.getItem("access_token")

        if (!accessToken) {
            console.log("no access token");
            return false;
        }

        try {
        await axios.post(
                "http://127.0.0.1:8000/api/token/verify/",
                {
                    token: accessToken
                }
                
            );
            console.log("is authenticated");
            return true;

        } catch (error) {
            if (error.response?.status === 401) {
                const refreshed = await refreshAccessToken();

                if (!refreshed) {
                    return false;
                }

                console.log("refreshed");
                // Veryify new access token
                return await authenticated();
                
            }

            console.log("not authenticated");
            return false;
        }
    }

    async function refreshAccessToken() {

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
            
            localStorage.setItem("access_token", response.data.access)

            if (response.data.refresh) {
                localStorage.setItem("refresh_token", response.data.refresh)
            }

            return true;


        } catch (error) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            console.log(error);
            console.log("not authenticated or refreshed, deleting token...");

            return false
        }

    }

    return await authenticated()
}

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