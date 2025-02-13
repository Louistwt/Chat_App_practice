import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config(); // access to the environment variable
const app = express();

const PORT = process.env.PORT; // using the PORT at .env

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true, // allow cookies and authentications to be sent as a request
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// starting server
app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});