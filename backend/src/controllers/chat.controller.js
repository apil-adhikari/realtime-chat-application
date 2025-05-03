import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
    try {
        // Getting a token
        const chatToken = generateStreamToken(req.user.id);

        res.status(200).json({
            status: "success",
            data: {
                token: chatToken,
            },
        });
    } catch (error) {
        console.error("Error in getStreamToken controller: ", error.message);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};
