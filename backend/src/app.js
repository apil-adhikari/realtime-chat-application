import express from "express";

import authRoutes from "./routes/auth.route.js";

const app = express();

// Middleware to read request data and put it in req object
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

export default app;
