import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

// Check if apiKey and apiSecret exists
if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

// Create Stream Client
const client = StreamChat.getInstance(apiKey, apiSecret);

// Create Stream User
export const upsertStreamUser = async (userData) => {
    try {
        // upsertUser - Update or Create the given user object
        await client.upsertUser(userData);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user: ", error);
    }
};

export const generateStreamToken = (userId) => {
    try {
        // Ensure userId is string
        const userIdStr = userId.toString();
        return client.createToken(userIdStr);
    } catch (error) {
        console.error("Error in generateStreamToken: ", error);
    }
};
