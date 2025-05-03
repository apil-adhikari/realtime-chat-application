import FriendRequest from "../models/friendRequest.model.js";
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

export const getMyFriends = async (req, res) => {
    try {
        // Get currently logged in user
        const currentUserId = req.user._id;
        const user = await User.findById(currentUserId)
            .select("friends")
            // Populates the friends field to include fullname,nativeLanguage,learningLanguage and profilePic additionally
            .populate(
                "friends",
                "fullname nativeLanguage learningLanguage profilePic"
            );

        res.status(200).json({
            status: "success",
            data: {
                users: user.friends,
            },
        });
    } catch (error) {
        console.error("Error in getMyFriends controller: ", error.message);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};

/** Send Friend Request
 * 1) Get sender and recipient
 * 2) Prevent sending request to ourself
 * 3) Check if the recipient exists?
 * 4) Check if we are already friend
 * 5) Check if there is a existing request
 */

export const sendFriendRequest = async (req, res) => {
    console.log("In sendFriendRequest");
    try {
        // 1) Get sender and recipient
        const myId = req.user.id; // Currently loggedin user
        const { id: recipientId } = req.params; // If id is sent as path

        // // If id is sent as query parameter
        // const { id: recipientId } = req.query;
        // console.log("RECIPIENT ID: ", recipientId);

        // 2) Prevent sending request to yourself
        if (myId === recipientId) {
            return res.status(400).json({
                status: "fail",
                message: "You cannot send request to yourself!",
            });
        }

        // 3) Check if recipient exists
        const recipient = await User.findById({ _id: recipientId });
        if (!recipient) {
            return res.status(400).json({
                status: "fail",
                message: "Recipient not found!",
            });
        }

        // 4) Check if we are already friends
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({
                status: "fail",
                message: "You are already friends with this user!",
            });
        }

        // 5) Check if there is existing request : either sender is me and recipient is recipientId or vice-versa
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        console.log(existingRequest);

        if (existingRequest) {
            return res.status(400).json({
                status: "fail",
                message:
                    "A friend request already exists between you and this user!",
            });
        }

        // Finally if we pass these steps, we can send friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        // Send response
        res.status(201).json({
            status: "success",
            data: {
                friend: friendRequest,
            },
        });
    } catch (error) {
        console.error("Error in sendFriendRequest controller: ", error.message);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};
