import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// ONLY FOR GETING TOKEN FOR STREAM CHAT
router.get("/chat-token", protectRoute, getStreamToken);

export default router;
