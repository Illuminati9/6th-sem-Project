import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    assignmentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
    },
    parentCommentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Comment", commentSchema);