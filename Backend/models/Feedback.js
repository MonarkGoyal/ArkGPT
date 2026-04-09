import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: "Anonymous"
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
    threadId: {
        type: String,
        trim: true,
        default: null
    },
    pageUrl: {
        type: String,
        trim: true,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Feedback", FeedbackSchema);