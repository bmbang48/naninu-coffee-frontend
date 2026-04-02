import { baseUrl } from "./baseUrl";

export const fetchWithAuth = async (endpoint, options:RequestInit = {})=>{
    const token = localStorage.getItem("token");

    const response = await fetch(`${baseUrl}/api${endpoint}`,{
        ...options,
        headers: {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            Authorization: token? `Bearer ${token}` : "",
            ...(options.headers || {})
        }
    });

    if(response.status === 401) {
        if(token === "SSO_LOGIN"){
            console.warn("SSO User, skip logout");
            return {};
        }

        localStorage.removeItem("token");
        window.location.href = "/";
        return;
    }

    const data = await response.json();
    return data;
}