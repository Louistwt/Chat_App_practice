import User from "../models/user.model.js"
import bcrypt from "bcryptjs" // Adds random string (salt) to hash password
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const{userName,email,password} = req.body
    try {
        // create user -> hash password -> create a token to authenticate
        if(!userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // check for invalid password
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        //check for duplicate userName
        const existingUserName = await User.findOne({ userName })

        if (existingUserName) return res.status(400).json({ message: "Username already exists" });
        
        //check for duplicate email
        const existingEmail = await User.findOne({ email })

        if (existingEmail) return res.status(400).json({ message: "Email already exists" });

        // hash password
        const salt = await bcrypt.genSalt(10) // 10 rounds of complexity
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User ({
            userName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            // generate JWT token
            generateToken(newUser._id, res) // MongoDB stores as _id instead of Id
            await newUser.save(); // save user at database

            res.status(201).json({
                _id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
        const { email, password } = req.body
    try{
        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" }) // not letting potentially malicious people to see what was invalid
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({ message: "Logged out successfully" });
    
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body; // can access directly because of protectRoute function
        const userId = req.user._id; 

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const fileSizeInBytes = (profilePic.length * (3 / 4)) - 2;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

        if (fileSizeInMB > 5) {
            return res.status(400).json({ message: "Profile pic must be less than 5MB"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic) // upload into cloudinary bucket for profile pic
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, {new: true})

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("error in update profile", error)
        res.status(500).json({ message: "Internet server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};