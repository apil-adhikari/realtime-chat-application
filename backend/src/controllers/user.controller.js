import User from "../models/user.model.js";

export const getRecommendedUsers = async (req, res) => {
    try {
        // Get current user Id from req.user
        const currentUserId = req.user._id;

        // We can find the current user from req.user as we aleardy have loggedin user in req or even doing findById({_id:currentUserId})
        const currentUser = req.user;

        // Check if the currently use has onboarded
        if (!currentUser.isOnboarded) {
            return res.status(400).json({
                status: "fail",
                message: "You are not onboarded. Please onboard to get access!",
            });
        }

        /**
         * Recommend Users
         * Minimum Conditions to display UI
         * - Loggedin user(own profile) should not come in recommendation
         * - Users that are already friends should not appear in recommendations
         */
        const recommendedUsers = await User.find({
            $and: [
                {
                    _id: { $ne: currentUserId }, // Exclude current user
                },
                {
                    _id: { $nin: currentUser.friends }, // Exclude current user's friends
                },
                {
                    isOnboarded: true, // Only show onboarded users
                },
            ],
        });

        res.status(200).json({
            status: "success",
            data: {
                users: recommendedUsers,
            },
        });
    } catch (error) {
        console.error(
            "Error in getRecommendedUsers controller: ",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};
