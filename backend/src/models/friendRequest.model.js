import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A request must have sender!"],
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A request must have recipient!"],
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
