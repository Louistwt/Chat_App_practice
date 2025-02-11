import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile); // only authenticated user can access updateProfile

router.get("/check", protectRoute, checkAuth); // check authentication

export default router;