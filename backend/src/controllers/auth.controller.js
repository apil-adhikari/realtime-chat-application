import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { upsertStreamUser } from "../lib/stream.js";

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

    // Validate Name
    if (fullname.length < 5) {
      return res.status(400).json({
        status: "fail",
        message: "Full Name must be at least 5 characters",
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

    // Random Profile Image(initially) using Avatar Placeholder API
    // const imageIndex = Math.floor(Math.random() * 100 + 1); // generate a number between 1-100
    const firstname = fullname.split(" ")[0];
    const lastname = fullname.split(" ")[1];
    // const randomAvatar = `https://avatar.iran.liara.run/public/${imageIndex}.png`; // Assigning a random image between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/username?username=${firstname}+${lastname}.png`; // generating image based on first and last name

    const newUser = await User.create({
      email,
      password,
      fullname,
      profilePic: randomAvatar,
    });

    try {
      // Creating Stream User seamlesly
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || "",
      });

      console.log(`Stream user created for ${newUser.fullname}`);
    } catch (error) {
      console.log("Error creating Stream user: ", error);
    }

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
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true, // Prevents XSS attacks
      sameSite: "strict", // Prevents CSRf attacks
      secure: process.env.NODE_ENV === "production", // Only set secure to true if the environment is in production
    };

    // Remove the password form the output. Not sending the password even when creating a new user ie. we should hide the password.
    newUser.password = undefined;

    res
      .cookie("jwt", token, cookieOptions)
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
  try {
    // Get required fields
    const { email, password } = req.body;

    // Verify if they are empty
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required!",
      });
    }

    // Check for correct email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email format!",
      });
    }

    // Check for user existance
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password!",
      });
    }

    // Verify the password with database
    const isPasswordCorrect = await user.matchPassword(
      password, // Password entered
      user.password // Password saved in database
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password!",
      });
    }

    // If everithing is valid then create the token and send it along with response
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true, // Prevents XSS attacks
      sameSite: "strict", // Prevents CSRf attacks
      secure: process.env.NODE_ENV === "production", // Only set secure to true if the environment is in production
    };

    // Remove the password form the output. Not sending the password even when creating a new user ie. we should hide the password.
    user.password = undefined;

    res.cookie("jwt", token, cookieOptions).status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error!",
    });
  }
};

// Logout
export const logout = async (req, res) => {
  res.clearCookie("jwt"); // We can either directly clear the cookies
  // res.cookie("jwt", "loggedout", { maxAge: 1000 * 1, httpOnly: true }); // Or we can set the cookies to differnt value
  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

// Onboard
export const onboard = async (req, res) => {
  try {
    // Get the user id of loggedin user
    const userId = req.user._id;
    const {
      fullname,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      profilePic,
    } = req.body;

    // Check if the user exists
    const userExists = await User.findById({ _id: userId });
    if (!userExists) {
      return res.status(400).json({
        status: "fail",
        message: "User not found!",
      });
    }

    // Check for missing values
    if (
      !fullname ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required!",
        missingFields: [
          !fullname && "fullname",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic,
        fullname,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        isOnboarded: true,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    // Update Stream User Info as well
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePic,
      });

      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullname}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding: ",
        streamError.message
      );
    }

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.log("Onboarding error: ", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error!",
    });
  }
};

// GET ME: get authenticated user
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error in getMe controller: ", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error!",
    });
  }
};
