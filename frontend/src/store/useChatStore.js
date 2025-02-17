import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });

        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isUsersLoading: false });

        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });

        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isMessagesLoading: false });

        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            // updating database with the new message to the selected user
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] }); // update State for UI

        } catch (error) {
            toast.error(error.response.data.message);

        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))