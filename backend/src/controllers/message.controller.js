import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user_id;
        // return users with
        const filteredUsers = await User.find({ _id: {$ne: loggedInUserId }}).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 1 to 1 messages
export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId } = req.params
        const myId = req.user._id;
        
        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId}, // find all messages by me to another user
                {senderId: userToChatId, receiverId: myId} // find all messages by another user to me
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ error: "Internet server error "});
    }
};

export const sendMessage = async (req, res) => {
    try {
        // setting the request
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // renaming to receiverId for cleaner code
        const senderId = req.user._id;

        let imageUrl;
        // Upload image to cloudinary if there is any
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message ({
            senderId,
            receiverId,
            text,
            image: imageUrl // undefinted or actual value if uploaded
        });

        await newMessage.save();

        // todo: realtime function with Socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};