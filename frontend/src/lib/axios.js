import axios from "axios";

// create an Axios instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api", // development url or production url
    withCredentials: true, // allows cookies, authentication tokens and sessions to be sent with requests
})

// Avoids repeating baseURL in every request
// Ensures all requests follow the same authentication rules
// Makes it easier to add interceptors (e.g. auto-refresh tokens)