import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        
        userName: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        profilePic: {
            type: String,
            default: "", // updated when there is a profile pic uploaded
        },
    },
    { timestamps: true } // showing createdAt and addedAt
);

const User = mongoose.model("User", userSchema); // mongoose will update the table name to "users"

export default User;