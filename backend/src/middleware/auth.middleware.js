import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware function to protect routes from unauthenticated user
 * - Get the token & check if it is there (if token exists)
 * - Validate the token(#VeryImportant Step) where we veriyt the token
 * - Check if user still exists (find the user from decoded data)
 * - Grant access to protected route by placing the found user in req.user
 * - Call next()
 */
export const protectRoute = async (req, res, next) => {
    try {
        let token;

        // Get the token (From authorization header and from cookies)
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
            // Also setting the cookie as jwt if there is no authorization came in header
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized - No token provided!",
            });
        }

        // Verify the token[Check if the payload is changed]
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decoded);

        if (!decode) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized - Invalid token!",
            });
        }

        // Grab the user from the decoded (user id sent as payload)
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message:
                    "Unauthorized - User not found(the user belonging to this token doesnot exits)",
            });
        }

        // Grant access to protected route
        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute controller: ", error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};
