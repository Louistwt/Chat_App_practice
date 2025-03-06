import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config(); // access to the environment variable

const PORT = process.env.PORT; // using the PORT at .env
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // allow cookies and authentications to be sent as a request
}));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); // put path to static assets

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html")); // running everything in one port
    })
}

// starting server
server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});