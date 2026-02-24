import { fetchWithAuth } from "./fetchWithAuth";
import { baseUrl } from "./baseUrl";

export const loginUser = async (email,password)=>{
    const response = await fetch(`${baseUrl}/api/login`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || "Login Gagal");
    }

    return data;
}


export const logoutUser = async () => {
  return await fetchWithAuth("/logout", {
    method: "POST",
  });
};