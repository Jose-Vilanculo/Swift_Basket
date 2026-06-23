export const isAuthenticated = () => {
    return !!localStorage.getItem("access_token");
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