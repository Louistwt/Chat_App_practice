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
            set({ isSigningUp: false }); // update sign up state
        }
    },
    
    // similar to signup
    login: async(data) => {
        set({ isLogginIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

        } catch (error) {
            toast.error(error.response.data.message); // get error message from login

        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("auth/logout");
            set({ authUser: Null });
            toast.success("Logged out successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data); 
            set({ authUser: res.data });
            toast.success("Profile updated successfully");

        } catch (error) {
            console.log("error in updating profile:", error);
            toast.error(error.response.data.message);

        } finally {
            set({ isUpdatingProfile: false });
        }
    },

}));