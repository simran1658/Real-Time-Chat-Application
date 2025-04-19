import axios from "axios";

export const axiosInstance = axios.create({ // Create an axios instance 
    baseURL: "http://localhost:3000/api", // Backend URL 
    withCredentials: true // Send cookies to backend server for session management (JWT) 
})