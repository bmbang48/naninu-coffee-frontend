import { baseUrl } from "./baseUrl";

export const fetchWithAuth = async (endpoint, options:RequestInit = {})=>{
    const token = localStorage.getItem("token");

    const response = await fetch(`${baseUrl}/api${endpoint}`,{
        ...options,
        headers: {
            "Content_Type" : "application/json",
            "Accept" : "application/json",
            Authorization: token? `Bearer ${token}` : "",
            ...(options.headers || {})
        }
    });

    if(response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
    }

    const data = await response.json();
    return data;
}