import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

// Middleware to read request data and put it in req object
app.use(express.json());

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

export default app;
