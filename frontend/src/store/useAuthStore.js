// Define a chunk of states and functions to use in different components

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null, // null as initial state
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check"); // use backend to check auth

            set({ authUser: res.data });

        } catch (error) { // user is not authenticated
            console.log("Error in checkAuth: ", error);
            
            set({ authUser: null });
            
        } finally {
            set({ isCheckingAuth: false }); // no longer checking authentication
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");

        } catch (error) {
            toast.error(error.response.data.message); // get error message from sign up

        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("auth/logout");
            set({ authUser: Null });
            toast.success("Logged out successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}));