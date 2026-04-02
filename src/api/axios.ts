import axios from "axios";
import { baseUrl } from "./baseUrl"; // file lu tadi

const api = axios.create({
  baseURL: `${baseUrl}/api`,
});

export default api;