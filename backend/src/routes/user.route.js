import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getRecommendedUsers,
    getMyFriends,
    sendFriendRequest,
    updateFriendRequestStatus,
} from "../controllers/user.controller.js";

const router = express.Router();

// User should be authenticated for all the routes:
router.use(protectRoute);

// Get recommended users
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

// Send friend request Endpoint
// URL with id parameter: http://localhost:8000/api/v1/users/friend-request/04f645323fjsdjfksdflsd => The /:id is a placeholder, so we cannot pass id as query but we need to pass the id as path
router.post("/friend-request/:id", sendFriendRequest);

// USE THIS IF WE WANT TO USE THE ID FROM query string
// router.post("/friend-request", sendFriendRequest);

// Accept Friend Request Endpoint
router.put("/friend-request", updateFriendRequestStatus);

export default router;
