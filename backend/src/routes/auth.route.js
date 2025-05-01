import express from "express";
import {
    login,
    logout,
    onboard,
    singup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// Creating Express Router
const router = express.Router();

router.post("/signup", singup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

export default router;
