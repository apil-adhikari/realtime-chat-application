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

// GET ME
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
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

// Accept or Reject friend request
export const updateFriendRequestStatus = async (req, res) => {
    try {
        // Get the request id from query parameter
        let { id: requestId } = req.query;
        requestId = requestId.toString();

        // Find friend request using that id
        const friendRequest = await FriendRequest.findById({ _id: requestId });

        if (!friendRequest) {
            return res.status(404).json({
                status: "fail",
                message: "Friend request not found!",
            });
        }

        /**
         * Verify the current user is the recipient
         * - Since we are accepting or rejecting the request, we must the the recipient of the requestp
         */

        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                status: "fail",
                message: "You are not authorized to accept this request!",
            });
        }

        // IF THESE TESTS PASS, now proceed to either accepting or rejecting the request
        // (we will test quey parameter)

        if (req.query.requestStatus == "accept") {
            // console.log("Request Status: ", req.query.requestStatus);

            // Accept the request
            friendRequest.status = "accepted";

            // If accepted, add each user to the other's friends array
            // $addToSet: adds elements to an array only if they do not already exist.

            await User.findByIdAndUpdate(friendRequest.sender, {
                $addToSet: { friends: friendRequest.recipient },
            });

            await User.findByIdAndUpdate(friendRequest.recipient, {
                $addToSet: { friends: friendRequest.sender },
            });

            // If accepted, send response
            res.status(200).json({
                status: "success",
                message: "Friend request accepted.",
            });
        } else if (req.query.requestStatus == "reject") {
            // console.log("Request Status: ", req.query.requestStatus);

            // Reject friend request and delete the friend request document as well
            friendRequest.status = "rejected";
            await FriendRequest.findByIdAndDelete(requestId);
            res.status(200).json({
                status: "success",
                message: "Friend request rejected.",
            });
        }
    } catch (error) {
        console.error("Error in updateFriendRequest controller: ", error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};

// Get friend requests
export const getAllFriendRequest = async (req, res) => {
    try {
        // get all the incoming requests where I am the recipient and the status of the request is "pending"
        const incomingFriendRequest = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate(
            "sender",
            "fullname profilePic nativeLanguage learningLanguage"
        );

        // GET ALL ACCEPTED REQUESTS:
        const acceptedRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullname profilePic");

        res.status(200).json({
            status: "sucess",
            totalIncomingFriendRequest: incomingFriendRequest.length(),
            data: {
                friendRequestsIncoming: incomingFriendRequest,
                friendRequestAccepted: acceptedRequest, // Accepted by other user
            },
        });
    } catch (error) {
        console.error(
            "Error in getAllFriendRequest controller: ",
            error.message
        );
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};

// OUTGOING FRIEND REQUEST
export const getOutgoingFriendRequest = async (req, res) => {
    try {
        // Sender should be logged in user and the request should be in pending state
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate(
            "recipient",
            "fullname profilePic nativeLanguage learningLanguage"
        );

        // Send response
        res.status(200).json({
            status: "success",
            data: {
                friendRequest: outgoingRequests,
            },
        });
    } catch (error) {
        console.error(
            "Error in getOutgoingFriendRequest controller: ",
            error.message
        );
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};
