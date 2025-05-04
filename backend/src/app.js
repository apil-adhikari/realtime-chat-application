import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();

// Middleware to read request data and put it in req object
app.use(express.json());

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// Use CORS
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true, // Allow frontend to send cookies
    })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chat", chatRoutes);

export default app;
