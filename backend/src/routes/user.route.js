import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getRecommendedUsers,
    getMyFriends,
} from "../controllers/user.controller.js";

const router = express.Router();

// User should be authenticated for all the routes:
// router.use(protectRoute);

// Get recommended users
router.get("/", protectRoute, getRecommendedUsers);
router.get("/friends", protectRoute, getMyFriends);

export default router;
