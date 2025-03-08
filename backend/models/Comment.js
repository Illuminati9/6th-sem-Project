import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    classroomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
    },
    assignmentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        default: null,
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