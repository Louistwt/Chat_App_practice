import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages } from "../controllers/message.controller.js"


const route = express.Router()

router.get("/users", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages); // the id would by dynamic depending on the user

export default router;