import { baseUrl } from "./baseUrl";
export const getCsrfCookie = async ()=>{
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
  credentials: 'include'
});
};