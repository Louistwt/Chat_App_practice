// Define a chunk of states and functions to use in different components

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

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
    }
}))