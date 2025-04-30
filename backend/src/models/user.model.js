import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "A user must enter full name!"],
            trim: true,
            minLength: [5, "Full Name must be atleast 5 characers long!"],
            maxLength: [70, "Full Name can not exceed 70 characers!"],
        },

        email: {
            type: String,
            required: [true, "A user must have a email address!"],
            trim: true,
            unique: [true, "Email address must be unique!"],
            lowercase: [true, "Email must be lowercase!"],
            maxLength: [
                320,
                "Email must be less than or equal to 320 characters!",
            ],
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address!",
            ],
        },

        password: {
            type: String,
            required: [true, "A user must input a password!"],
            trim: true,
            minLength: [8, "Password must be at least 8 characters!"],
            maxLength: [
                128,
                "Password must be less than or equal to 128 characters!",
            ],
            select: false,
        },

        bio: {
            type: String,
            default: "",
        },

        profilePic: {
            type: String,
            default: "",
        },

        nativeLanguage: {
            type: String,
            default: "",
        },

        learningLanguage: {
            type: String,
            default: "",
        },

        isOnboarded: {
            type: Boolean,
            default: false,
        },

        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

// Password Hashing using mongoose Pre Save Hook
userSchema.pre("save", async function (next) {
    // OPTIMIZATION: Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

export default User;
