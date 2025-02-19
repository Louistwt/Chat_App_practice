// Define a chunk of states and functions to use in different components

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null, // null as initial state
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check"); // use backend to check auth
            set({ authUser: res.data });

            get().connectSocket();

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

            get().connectSocket();

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

            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message); // get error message from login

        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get().disconnectSocket()

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

    connectSocket: () => {
        const { authUser } = get()
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect()

        set({ socket: socket });

        // listen to this event of getOnlineUsers as soon as login, get userIds as data, update onlineUsers array.
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect(); // only implement disconnect function for connected users
    },

}));