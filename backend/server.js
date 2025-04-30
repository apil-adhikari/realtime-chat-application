import "dotenv/config";
// import doenv from "dotenv";
// doenv.config({});
import app from "./src/app.js";
import { connectDB } from "./src/lib/db.js";

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
