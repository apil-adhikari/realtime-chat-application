import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

// Signup
export const singup = async (req, res) => {
    const { email, password, fullname } = req.body;

    try {
        // Validate the fields (required fields should not be empty)
        if (!email || !password || !fullname) {
            return res.status(400).json({
                status: "fail",
                message: "All fields are required!",
            });
        }

        // Validate for correct email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid email format!",
            });
        }

        // Validate Password length
        if (password.length < 8) {
            return res.status(400).json({
                status: "fail",
                message: "Password must be at least 8 characters!",
            });
        }

        // Check if the user already exists with the email address
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "Email already exists, please use a different one!",
            });
        }

        // If everything is valid, we proceed to create new user

        // Random Profile Image(initially)
        const imageIndex = Math.floor(Math.random() * 100 + 1); // generate a number between 1-100
        const firstname = fullname.split(" ")[0];
        const lastname = fullname.split(" ")[1];
        // const randomAvatar = `https://avatar.iran.liara.run/public/${imageIndex}.png`;
        const randomAvatar = `https://avatar.iran.liara.run/username?username=${firstname}+${lastname}.png`;

        const newUser = await User.create({
            email,
            password,
            fullname,
            profilePic: randomAvatar,
        });

        // TODO: Create the user in STREAM as well

        // Generate a token
        const token = jwt.sign(
            {
                userId: newUser._id, // Unique token identifier, a user will be linked with the generated token
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        const cookieOptions = {
            maxage: 1000 * 60 * 60 * 60 * 24 * 7,
            httpOnly: true, // Prevents XSS attacks
            sameSite: "strict", // Prevents CSRf attacks
            secure: process.env.NODE_ENV === "production", // Only set secure to true if the environment is in production
        };

        res.cookie("jwt", token, cookieOptions)
            .status(201)
            .json({
                status: "success",
                data: {
                    user: newUser,
                },
            });
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};

// Login
export const login = async (req, res) => {
    res.send("Login Route");
};

// Logout
export const logout = async (req, res) => {
    res.send("Logout Route");
};
