import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    marks: {
        type: Number,
        required: true,
    },
    assignmentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
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

export default mongoose.model("Question", questionSchema);