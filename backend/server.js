import "dotenv/config";
// import doenv from "dotenv";
// doenv.config({});
import app from "./src/app.js";

// Authentication Routes
app.get("/api/v1/auth/signup", (req, res) => {
    res.send("Signup Route");
});
app.get("/api/v1/auth/login", (req, res) => {
    res.send("Login Route");
});
app.get("/api/v1/auth/logout ", (req, res) => {
    res.send("Logout Route");
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
